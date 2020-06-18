var validateRequired = require('../../validator').validateRequired;
var actionTypes = require('../../actionTypes');
module.exports.generatorName = require('path').basename(__dirname);


module.exports.generator = {
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
            name: 'existingServer',
            default: false,
            message: 'Do you want to use an existing SQL Server?'
        },
        {
            type: 'confirm',
            name: 'enableFirewall',
            default: true,
            message: 'Do you want to enable the firewall (highly recommended)?',
            when: function (answers) {
                return !answers.existingServer;
            },
        },
        {
            type: 'confirm',
            name: 'enableServiceEndpoint',
            default: false,
            message: 'Do you want to enable service endpoint?',
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
            message: 'Do you want to use an existing storage account for audit?',
            when: function (answers) {
                return answers.enableAudit || answers.enableDBAudit;
            }
        },
        {
            type: 'confirm',
            name: 'enableLTR',
            default: false,
            message: 'Do you want to enable long-term retention backups?',
            when: function (answers) {
                return answers.createDB;
            }
        },
        {
            type: 'confirm',
            name: 'enableAAD',
            default: false,
            message: 'Do you want to enable Azure AD admin?',
            when: function (answers) {
                return answers.createDB;
            }
        },
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};