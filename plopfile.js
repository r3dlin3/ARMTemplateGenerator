var repeatHelper = require('handlebars-helper-repeat');
const chalk = require('chalk');


function validateRequired(value) {
    return value.trim() !== '';
}

function validateUnsignedInteger(value) {
    var reg = /^\d+$/;
    return reg.test(value);
}

module.exports = function (plop) {
    // helpers for template generation
    plop.setHelper('repeat', repeatHelper);
    plop.setHelper('is', function (arg1, arg2, opts) {
        if (arg1 == arg2) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    });
    plop.setHelper('isnot', function (arg1, arg2, opts) {
        if (arg1 != arg2) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    });
    plop.setActionType('printHelpDeployment', function (answers, config, plop) {
        // do something
        console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
        console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\'+answers.name+'.json -TemplateParameterFile .\\generated\\'+answers.name+'.parameters.json'));
        return '';
    });

    // Generators
    plop.setGenerator('VM', {
        description: 'This module generates ARM template file for a VM',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },            
            {
                type: 'confirm',
                name: 'existingVNET',
                default: true,
                message: 'Do you want to use an existing VNET?'
            },
            {
                type: 'confirm',
                name: 'existingSubnet',
                default: true,
                when: function( answers ) {
                    return answers.existingVNET;
                  },
                message: 'Do you want to use an existing subnet?',
                validate: validateRequired
            },
            {
                type: 'list',
                name: 'privateIPtype',
                default: "Static",
                message: 'Do you want to use a private IP address dynamic or static?',
                choices: ["Static", "Dynamic"],
            },
            {
                type: 'confirm',
                name: 'hasPublicIP',
                default: true,
                message: 'Do you want to use a public IP address?'
            },
            {
                type: 'list',
                name: 'publicIPtype',
                default: "Dynamic",
                message: 'Do you want to use a public IP address dynamic or static?',
                choices: ["Static", "Dynamic"],
                when: function (answers) {
                    return answers.hasPublicIP;
                },
            },
            {
                type: 'confirm',
                name: 'remoteAccess',
                default: true,
                message: 'Do you want to open remote access port?',
                when: function( answers ) {
                    return answers.hasPublicIP;
                },
            },
            {
                type: 'list',
                name: 'osPublisher',
                default: 0,
                message: 'What is the OS?',
                choices: ['MicrosoftWindowsServer', 'Canonical', 'RedHat']
            },
            {
                type: 'list',
                name: 'osOffer',
                default: 0,
                message: 'What is the OS offer?',
                choices: function(answers) {
                    switch (answers.osPublisher) {
                        case 'MicrosoftWindowsServer':
                            return  ['WindowsServer']
                        case 'Canonical':
                            return ['UbuntuServer']
                        case 'RedHat':
                            return ['RHEL']
                        default:
                            break;
                    }
                }
            },
            {
                type: 'list',
                name: 'osSku',
                default: 0,
                message: 'What is the OS SKU?',
                choices: function(answers) {
                    switch (answers.osOffer) {
                        case 'WindowsServer':
                            return ["2012-Datacenter",
                            "2012-R2-Datacenter",
                            "2016-Nano-Server",
                            "2016-Datacenter-with-Containers",
                            "2016-Datacenter"];
                            
                        case 'UbuntuServer':
                            return ['14.04.5-LTS',
                            "14.04.5-LTS",
                            "15.10",
                            "16.04.0-LTS"]
                        case 'RHEL':
                            return ['7.2']
                        default:
                            break;
                    }
                }
            },
            {
                type: 'input',
                name: 'nbDataDisk',
                default: 2,
                message: 'How many data disk?',
                validate: validateUnsignedInteger
            },
            {
                type: 'confirm',
                name: 'hasAutoShutdown',
                default: true,
                message: 'Do you want to plan an auto-shutdown?',
            },
            {
                type: 'confirm',
                name: 'isDiagnosticsEnabled',
                default: false,
                message: 'Do you want to enable diagnostics?',
            },
            {
                type: 'confirm',
                name: 'existingStorage',
                default: false,
                message: 'Do you want to use an existing storage account?',
                when: function (answers) {
                    return answers.isDiagnosticsEnabled;
                }
            },
            {
                type: 'confirm',
                name: 'isADJoined',
                default: false,
                message: 'Do you want to join the VM to Active Directory?',
            },
            {
                type: 'input',
                name: 'nbExtension',
                default: 0,
                message: 'How many VM extensions do you want to add?',
                validate: validateUnsignedInteger
            },
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "templates/VM/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "templates/VM/azuredeploy.json"
            }
        ]  // array of actions
    });

    plop.setGenerator('Key Vault', {
        description: 'This module generates ARM template file for a Azure Key Vault',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },
            {
                type: 'confirm',
                name: 'createSecret',
                default: true,
                message: 'Do you want to provision a secret?'
            },
            {
                type: 'confirm',
                name: 'isDiagnosticsEnabled',
                default: false,
                message: 'Do you want to enable diagnostics?',
            },
            {
                type: 'confirm',
                name: 'existingStorage',
                default: false,
                message: 'Do you want to use an existing storage account?',
                when: function (answers) {
                    return answers.isDiagnosticsEnabled;
                }
            },  
            {
                type: 'confirm',
                name: 'isProtectWithLocks',
                default: false,
                message: 'Do you want to lock the Key Vault?',
            }, 
            {
                // The property enableSoftDelete does not support false value \o/
                // Therefore, we manage the presence of this property with 
                // a new flag
                type: 'confirm',
                name: 'enableSoftDelete',
                default: false,
                message: 'Do you want to enable soft delete?',
            }, 
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "templates/KeyVault/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "templates/KeyVault/azuredeploy.json"
            },

        ]  // array of actions
    });

    plop.setGenerator('SQL', {
        description: 'This module generates ARM template file for a SQL Server and/or Database',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },
            {
                type: 'confirm',
                name: 'enableAudit',
                default: true,
                message: 'Do you want to enable Audit at the server level?'
            },
            {
                type: 'confirm',
                name: 'enableThreatDetection',
                default: false,
                message: 'Do you want to enable threat Detection at the server level?',
                when: function (answers) {
                    return answers.enableAudit;
                }
            },
            {
                type: 'confirm',
                name: 'createDB',
                default: false,
                message: 'Do you want to create a database?'
            },    
            {
                type: 'confirm',
                name: 'enableDBAudit',
                default: true,
                message: 'Do you want to enable audit at the database level?',
                when: function (answers) {
                    return (answers.createDB && !(answers.enableAudit));
                }
            },
            {
                type: 'confirm',
                name: 'enableDBThreatDetection',
                default: true,
                message: 'Do you want to enable Threat Detection at the database level?',
                when: function (answers) {
                    return answers.createDB && !(answers.enableAudit) && answers.enableDBAudit;
                }
            },
            {
                type: 'confirm',
                name: 'existingStorage',
                default: false,
                message: 'Do you want to use an existing storage account?',
                when: function (answers) {
                    return answers.enableAudit||answers.enableDBAudit;
                }
            },   
            {
                type: 'confirm',
                name: 'useKeyVault',
                default: false,
                message: 'Do you want to use a Key Vault for password?',
            }, 

            
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "templates/SQL/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "templates/SQL/azuredeploy.json"
            }

        ]  // array of actions
    });

    plop.setGenerator('DataLakeStore', {
        description: 'This module generates ARM template file for a Data Lake Store',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },            
            {
                type: 'confirm',
                name: 'createFirewallRules',
                default: true,
                message: 'Do you want to create firewall rules?'
            },
            {
                type: 'confirm',
                name: 'useKeyVault',
                default: true,
                message: 'Do you want to use a Key Vault for encryption?'
            }
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "templates/DataLakeStore/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "templates/DataLakeStore/azuredeploy.json"
            },
            {
                type: "printHelpDeployment"
            }
        ]  // array of actions
    });

    plop.setGenerator('AppService', {
        description: 'This module generates ARM template file for an App Service',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },            
            {
                type: 'confirm',
                name: 'existingASP',
                default: false,
                message: 'Do you want to use an existing App Service Plan?'
            },
            {
                type: 'confirm',
                name: 'createSlot',
                default: false,
                message: 'Do you want to create slots?',
            },
            {
                type: 'confirm',
                name: 'createAppInsights',
                default: false,
                message: 'Do you want to create an App Insights?',
            },
            {
                type: 'confirm',
                name: 'createCDN',
                default: false,
                message: 'Do you want to create a CDN?',
            },
            {
                type: 'confirm',
                name: 'createCache',
                default: false,
                message: 'Do you want to create a Redis cache?',
            },
            
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "templates/AppService/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "templates/AppService/azuredeploy.json"
            },
            {
                type: "printHelpDeployment"
            }
        ]  // array of actions
    });
};
