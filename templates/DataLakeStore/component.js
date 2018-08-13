var validateRequired = require('../../validator').validateRequired;
const chalk = require('chalk');

module.exports = function (plop) {
plop.setActionType('printHelpDeployment', function (answers, config, plop) {
    // do something
    console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
    console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    return '';
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
}