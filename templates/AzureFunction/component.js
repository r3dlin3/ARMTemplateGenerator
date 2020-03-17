var validateRequired = require('../../validator').validateRequired;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'Azure Function';
module.exports.generator = {
    description: 'This module generates ARM template file for an Azure Function',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'isDedicatedPlan',
            default: false,
            message: 'Do you want to use a dedicated plan?',
        },
        {
            type: 'confirm',
            name: 'isLinux',
            default: false,
            message: 'Do you want to use a Linux plan?',
        },
        {
            type: 'confirm',
            name: 'createManagedServiceIdentity',
            default: false,
            message: 'Do you want to create a managed service identity?',
        },

    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};