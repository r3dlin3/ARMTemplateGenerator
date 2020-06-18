<#
.SYNOPSIS 
    Deploy ARM template with nested templates.
.DESCRIPTION
    The script:
    1) Checks the existence of resource groups and creates them if needed
    2) Checks the existence of storage account and the container and creates them if needed
    3) Uploads all files present along with the template file, including folders
    4) Deploys the ARM template with the parameters.
    The ARM template MUST have the parameters _artifactsLocation (string) and _artifactsLocationSasToken (securestring)
    to pass the base URL for files and the SAS token.
    In the template:
    "_artifactsLocation": {
        "type": "string",
        "metadata": {
            "description": "Base URL for nested templates"
        }
    },
    "_artifactsLocationSasToken": {
        "type": "securestring",
        "metadata": {
            "description": "SAS token for nested templates"
        }
    }
    
    How to use it:

    {
        "type": "Microsoft.Resources/deployments",
        "apiVersion": "2017-05-10",
        "name": "XXXLinkedTemplate",
        "properties": {
            "mode": "Incremental",
            "templateLink": {
                "uri": "[concat(parameters('_artifactsLocation'),'/Nested/XXX.json', parameters('_artifactsLocationSasToken'))]",
                "contentVersion": "1.0.0.0"
            },
            "parameters": {
                "foo": {
                    "value": "bar"
                }
            }
        }
    },
.PARAMETER ResourceGroupName
    Resource group used to deploy to 
.PARAMETER TemplateFilePath
    Path to the template
.PARAMETER ParamFilePath
    Path to the parameters
.PARAMETER storageResourceGroupName
    Name of the resource group of the storage account
     (creates it if it does not exists)
.PARAMETER StorageAccountName
    Name of the storage account to use (creates it if it does not exists)
.PARAMETER storageContainer
    Name of the container in the storage account to use for upload files
     (creates it if it does not exists)
    NOTE: the scripts uploads inside a folder inside this container
.PARAMETER location
    Location used for the creation of the resources if they 
    do not exist already: resource groups, storage account
.PARAMETER deploymentName

#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$ResourceGroupName,
    [ValidateScript({Test-Path -Path $_ -PathType Leaf})]
    [string]$TemplateFilePath = 'azuredeploy.json',
    [ValidateScript({Test-Path -Path $_ -PathType Leaf})]
    [string]$ParamFilePath = 'azuredeploy.parameters.json',

    [string]$storageResourceGroupName,
    [string]$StorageAccountName,
    [string]$storageContainer,
    [string]$location,
    [string]$deploymentName
)

BEGIN {
    Set-StrictMode -Version latest
    $ErrorActionPreference = "stop" 
    
    $stopWatch = [system.diagnostics.stopwatch]::StartNew()
} #BEGIN

PROCESS {
    #region --- Functions ---

    function Confirm {
        param(
            [Parameter(Mandatory)]
            [string]
            $Title,
            [Parameter(Mandatory)]
            [string]
            $Message
        )
        $yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes"
        $no = New-Object System.Management.Automation.Host.ChoiceDescription "&No"
        $options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)
        $result = $host.ui.PromptForChoice($title, $message, $options, 1)
        0 -eq $result
    }
    function Get-DefaultLocation {
        if (-not $script:Location) {
            $script:Location = Read-Host -Prompt "Resource group location"
        }
        $script:Location
    }
    function Test-LoginAz {
        <#
        .SYNOPSIS
            Test if the user is already logged in or not
        #>
        $ctx = Get-AzContext
        if (-not $ctx) {
            Login-AzAccount
        }
    }

    function Test-RG {
        <#
        .SYNOPSIS
            Test if the resource group exists
        #>
        param(
            [string] $ResourceGroupName
        )
        $rg = Get-AzResourceGroup -name $ResourceGroupName -ea 0
        ($null -ne $rg)
    }

    function Ensure-RG {
        param(
            [string] $ResourceGroupName
        )

        if (-not (Test-RG $ResourceGroupName)) {
            Write-Verbose "RG $ResourceGroupName does not exist"

            New-AzResourceGroup -Name $ResourceGroupName -Location (Get-DefaultLocation) | Out-Null
        }
    }

    function Test-StorageAccount {
        param(
            [Parameter(Mandatory)]
            [string] $StorageAccountName,
            [Parameter(Mandatory)]
            [string] $ResourceGroupName
        )
        $sto = Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName  -ea 0
        ($null -ne $sto)
    }

    function Test-Container {
        param(
            [Parameter(Mandatory, ParameterSetName = 'Name')]
            [string] $StorageAccountName,
            [Parameter(Mandatory, ParameterSetName = 'Name')]
            [string] $ResourceGroupName,
            [Parameter(Mandatory, ParameterSetName = 'Ctx')]
            $Context,
            [Parameter(Mandatory)]
            [string] $Container
        )
        if ("Ctx" -eq $PSCmdlet.ParameterSetName) {
            $ctx = $Context
        }
        else {
            $sto = Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName
            $ctx = $sto.Context
        }
        $container = Get-AzStorageContainer -Context $ctx -Container $Container -ea 0
        ($null -ne $container)
    }

    function Ensure-StorageAccount {
        param(
            [Parameter(Mandatory)]
            [Alias("Name")]
            [string] $StorageAccountName,
            [Parameter(Mandatory)]
            [string] $ResourceGroupName,
            [Parameter(Mandatory)]
            [string] $container
        )

        if (-not (Test-StorageAccount -ResourceGroupName $ResourceGroupName -StorageAccountName $StorageAccountName)) {
            Write-Verbose "Storage $ResourceGroupName/$StorageAccountName does not exist"
            New-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName  -Location (Get-DefaultLocation) -SkuName Standard_LRS
            Write-Verbose "Storage $ResourceGroupName/$StorageAccountName created"
        }
        $ctx = (Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName).Context
        if (-not (Test-Container -Context $ctx -container $container)) {
            Write-Verbose "Container $ResourceGroupName/$StorageAccountName/$container does not exist"
            New-AzStorageContainer -Name $container -Context $ctx -Permission Off
            Write-Verbose "Container $ResourceGroupName/$StorageAccountName/$container created"
        }
    }

    function Upload-Folder {
        <#
        .SYNOPSIS
            Upload folder content to blob storage
        #>
        param(
            [Parameter(Mandatory)]
            [string] $StorageAccountName,
            [Parameter(Mandatory)]
            [string] $ResourceGroupName,
            [Parameter(Mandatory)]
            [string] $containerName,
            [Parameter(Mandatory)]
            [string] $remotefolder,
            [Parameter(Mandatory)]
            [ValidateScript( { Test-Path -Path $_ -PathType Container })]
            [string] $localfolder,
            [switch] $Force
        )
        
        Write-Verbose "Uploading $localfolder to $ResourceGroupName/$storageResourceGroupName/$containerName/$remotefolder"
        $localfolderAbsolutePath = (Resolve-Path $localfolder).Path
        Write-Verbose "localfolderAbsolutePath = $localfolderAbsolutePath"
        
        $ctx = (Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName).Context

        $files = Get-ChildItem $localfolder -Recurse -File

        foreach ($file in $files) { 
            $ffn = $file.fullname
            $targetPath = ($ffn.Substring($localfolderAbsolutePath.Length + 1)).Replace("\", "/")
            $targetPath = "$tmpFolder/$targetPath"
            Write-Verbose "Uploading $ffn to $containerName/$targetPath"
            Set-AzStorageBlobContent -File $ffn `
                -Container $containerName `
                -Blob $targetPath `
                -Context $ctx `
                -Force:$Force | Out-Null
        }
    }
    #endregion Functions

    Test-LoginAz

    Ensure-RG -ResourceGroupName $ResourceGroupName
    Ensure-RG -ResourceGroupName $storageResourceGroupName
    Ensure-StorageAccount -ResourceGroupName $storageResourceGroupName -StorageAccountName $StorageAccountName -container $storageContainer

    $tmpFolder = [guid]::NewGuid().ToString()
    $localfolder = [System.IO.Path]::GetDirectoryName( (Get-ItemProperty $TemplateFilePath) )
    Upload-Folder -container $storageContainer `
                -ResourceGroupName $storageResourceGroupName `
                -StorageAccountName $StorageAccountName `
                -remotefolder $tmpFolder `
                -localfolder $localfolder
    

    $OptionalParameters = @{}
    # Constants for params for Storage Account URL and SAS token
    $ArtifactsLocationName = '_artifactsLocation'
    $ArtifactsLocationSasTokenName = '_artifactsLocationSasToken'

    $ctx = (Get-AzStorageAccount -ResourceGroupName $storageResourceGroupName -Name $StorageAccountName).Context
    $OptionalParameters[$ArtifactsLocationName] = "{0}{1}/{2}/" -f $ctx.BlobEndPoint,$storageContainer,$tmpFolder
    Write-Verbose "$ArtifactsLocationName = $($OptionalParameters[$ArtifactsLocationName])"
    # Generate a 4 hour SAS token for the artifacts location if one was not provided in the parameters file
    $OptionalParameters[$ArtifactsLocationSasTokenName] = ConvertTo-SecureString -AsPlainText -Force `
            (New-AzStorageContainerSASToken -Container $storageContainer -Context $ctx -Permission r -ExpiryTime (Get-Date).AddHours(4))

    if (-not $deploymentName) {
        $deploymentName = ((Get-ChildItem $TemplateFilePath).BaseName + '-' + ((Get-Date).ToUniversalTime()).ToString('yyyyMMdd-HHmmss')) `
    }

    New-AzResourceGroupDeployment -Name $deploymentName `
        -ResourceGroupName $ResourceGroupName `
        -TemplateFile $TemplateFilePath `
        -TemplateParameterFile $ParamFilePath `
        @OptionalParameters `
        -Force -Verbose


}#PROCESS

END {
    Write-Host "Deployment run in $($stopWatch.Elapsed.ToString())"
    Write-Verbose -Message "$($MyInvocation.MyCommand.Name) Completed"    
}#END
