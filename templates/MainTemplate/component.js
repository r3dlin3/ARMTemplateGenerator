var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'Main Template';
module.exports.generator = {
    description: 'This module generates ARM template file for a Main Template to include nested templates',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            default: "azuredeploy",
            validate: validateRequired
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};