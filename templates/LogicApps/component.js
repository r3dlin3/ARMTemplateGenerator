var validateRequired = require('../../validator').validateRequired;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'LogicApps';
module.exports.generator = {
    description: 'This module generates ARM template file for a LogicApps',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'isDiagnosticsEnabled',
            default: false,
            message: 'Do you want to enable Log Analytics?',
        },
        {
            type: 'confirm',
            name: 'existingLogAnalytics',
            default: false,
            message: 'Do you want to use an existing Log Analytics?',
            when: function (answers) {
                return answers.isDiagnosticsEnabled;
            }
        },
        {
            type: 'confirm',
            name: 'enableManagedIdentity',
            default: false,
            message: 'Do you want a system-assigned managed identity on the App Service?',
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};