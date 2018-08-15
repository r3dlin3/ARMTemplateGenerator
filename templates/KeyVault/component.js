var validateRequired = require('../../validator').validateRequired;

module.exports = function (plop) {
    plop.load('../../actionTypes.js');
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
                path: "generated/{{name}}.json",
                templateFile: "./azuredeploy.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            },
            {
                type: "printHelpDeployment"
            }

        ]  // array of actions
    });

}