var validateRequired = require('../../validator').validateRequired;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'Key Vault'

module.exports.generator = {
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
            type: 'confirm',
            name: 'isRbacEnabled',
            default: false,
            message: 'Do you want to use RBAC for access control?',
        },
        {
            type: 'confirm',
            name: 'grantRbacPermision',
            default: true,
            message: 'Do you want to grant RBAC permission on the Key Vault?',
            when: function (answers) {
                return answers.isRbacEnabled;
            }
        },
        {
            // The property "enablePurgeProtection" cannot be set to false. 
            // Enabling the purge protection for a vault is an irreversible action.
            // Therefore, we manage the presence of this property with a new flag
            type: 'confirm',
            name: 'enablePurgeProtection',
            default: false,
            message: 'Do you want to enable purge protection?',
        },
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};