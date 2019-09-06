var validateRequired = require('../../validator').validateRequired;

module.exports = function (plop) {
    plop.load('../../actionTypes.js');
    plop.setGenerator('Key Vault', {
        description: 'This module generates ARM template file for an Azure Automation',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },
            {
                type: 'confirm',
                name: 'deployModules',
                default: true,
                message: 'Do you want to deploy modules?'
            },
            {
                type: 'confirm',
                name: 'deployDSC',
                default: true,
                message: 'Do you want to create a DSC configuration?'
            },
            {
                type: 'confirm',
                name: 'deployRunbook',
                default: true,
                message: 'Do you want to deploy a runbook?'
            },
            {
                type: 'confirm',
                name: 'createConnection',
                default: true,
                message: 'Do you want to create a connection?'
            }
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "./azuredeploy.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            },
            {
                type: "addMany",
                base: "./nested",
                destination: "generated/AzureAutomation/nested",
                templateFiles:  "./nested/**/*.json"
            },
            {
                type: "printHelpDeployment"
            }

        ]  // array of actions
    });

}