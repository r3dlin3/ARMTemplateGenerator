var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'Azure Firewall';
module.exports.generator = {
    description: 'This module generates ARM template file for an Azure Firewall',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'isLogEnabled',
            default: false,
            message: 'Do you want to enable Azure Firewall logs and metrics?',
        },
        {
            type: 'confirm',
            name: 'useExistingWorkspace',
            default: false,
            message: 'Do you want to use an existing Log Analytics Workspace?',
            when: function (answers) {
                return answers.isLogEnabled;
            },
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};