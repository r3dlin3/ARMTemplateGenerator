var validateRequired = require('../../validator').validateRequired;

module.exports.generatorName = require('path').basename(__dirname);
module.exports.generator = {
    description: 'This module generates a new generator',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the generator?',
            validate: validateRequired
        }
    ], // array of inquirer prompts
    actions: [
        {
            type: "add",
            path: "templates/{{properCase name}}/azuredeploy.json",
            templateFile: __dirname + "/azuredeploy.json"
        },
        {
            type: "add",
            path: "templates/{{properCase name}}/azuredeploy.parameters.json",
            templateFile: __dirname + "/azuredeploy.parameters.json"
        },
        {
            type: "add",
            path: "templates/{{properCase name}}/component.js",
            templateFile: __dirname + "/component.tpl"
        }
    ] // array of actions
};