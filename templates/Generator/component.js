var validateRequired = require('../../validator').validateRequired;

module.exports = function (plop) {
    plop.setGenerator('Generator', {
        description: 'This module generates a new generator',
        prompts: [{
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
                templateFile: "./azuredeploy.json"
            },
            {
                type: "add",
                path: "templates/{{properCase name}}/azuredeploy.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "templates/{{properCase name}}/component.js",
                templateFile: "./component.tpl"
            }
        ] // array of actions
    });
}