var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'Azure Database for MySQL';
module.exports.generator = {
    description: 'This module generates ARM template file for a Azure Database for MySQL',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'enableFirewall',
            default: true,
            message: 'Do you want to enable the firewall (highly recommended)?',
        },
        {
            type: 'confirm',
            name: 'enableServiceEndpoint',
            default: false,
            message: 'Do you want to enable service endpoint?',
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};