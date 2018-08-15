var validateRequired = require('../../validator').validateRequired;
const chalk = require('chalk');

module.exports = function (plop) {
plop.setActionType('printHelpDeployment', function (answers, config, plop) {
    // do something
    console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
    console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    return '';
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
}