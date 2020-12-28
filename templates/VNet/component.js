var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'VNet';
module.exports.generator = {
    description: 'This module generates ARM template file for a VNet',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'customDnsServer',
            message: 'Do you want to configure a custom DNS?',
            default: false
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};