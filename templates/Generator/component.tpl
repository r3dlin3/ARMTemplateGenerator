var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;

module.exports = function (plop) {
    plop.load('../../actionTypes.js');
    plop.setGenerator('{{name}}', {
        description: 'This module generates ARM template file for a {{name}}',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            }
        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/\{{name}}.json",
                templateFile: "./azuredeploy.json"
            },
            {
                type: "add",
                path: "generated/\{{name}}.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            },
            {
                type: "printHelpDeployment"
            }
        ] // array of actions
    });
}