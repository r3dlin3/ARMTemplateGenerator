var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'AKS';
module.exports.generator = {
    description: 'This module generates ARM template file for a AKS',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'createCredentials',
            default: false,
            message: 'Do you want to provide credentials (SSH key or password) for the nodes?'
        },
        {
            type: 'confirm',
            name: 'existingVNET',
            default: false,
            message: 'Do you want to use an existing VNET?'
        },
        {
            type: 'confirm',
            name: 'enableLogging',
            default: true,
            message: 'Do you want to activate logging?'
        },
        {
            type: 'confirm',
            name: 'createWorkspace',
            default: false,
            message: 'Do you want to create a Log Analytics Workspace?',
            when: function (answers) {
                return answers.enableLogging;
            },
        },
        {
            type: 'confirm',
            name: 'deployAcr',
            default: false,
            message: 'Do you want to create an Azure Container Registry?'
        },
        {
            type: 'confirm',
            name: 'enableGeoReplication',
            default: false,
            message: 'Do you want to enable Geo Replication on ACR?',
            when: function (answers) {
                return answers.deployAcr;
            },
        },
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};