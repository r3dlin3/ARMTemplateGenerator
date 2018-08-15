var validateRequired = require('../../validator').validateRequired;

module.exports = function (plop) {

    plop.load('../../actionTypes.js');
    plop.setGenerator('SQL', {
        description: 'This module generates ARM template file for a SQL Server and/or Database',
        prompts: [{
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },
            {
                type: 'confirm',
                name: 'existingServer',
                default: false,
                message: 'Do you want to use an existing SQL Server?'
            },
            {
                type: 'confirm',
                name: 'enableFirewall',
                default: false,
                message: 'Do you want to enable the firewall?',
                when: function (answers) {
                    return !answers.existingServer;
                },
            },
            {
                type: 'confirm',
                name: 'enableAudit',
                default: true,
                when: function (answers) {
                    return !answers.existingServer;
                },
                message: 'Do you want to enable Audit at the server level?'
            },
            {
                type: 'confirm',
                name: 'enableThreatDetection',
                default: false,
                message: 'Do you want to enable threat Detection at the server level?',
                when: function (answers) {
                    return answers.enableAudit && !answers.existingServer;
                }
            },
            {
                type: 'confirm',
                name: 'createDB',
                default: true,
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
                    return answers.enableAudit || answers.enableDBAudit;
                }
            },
            /*
            {
                type: 'confirm',
                name: 'useKeyVault',
                default: false,
                message: 'Do you want to use a Key Vault for password?',
            },
            */

        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "./SQL/azuredeploy.json"
            },
            {
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            },
            {
                type: "printHelpDeployment"
            }

        ] // array of actions
    });
}