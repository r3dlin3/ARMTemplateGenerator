var validateRequired = require('../../validator').validateRequired;

module.exports.generatorName = 'App Service';
module.exports.generator = {
    description: 'This module generates ARM template file for an App Service',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'existingASP',
            default: false,
            message: 'Do you want to use an existing App Service Plan?'
        },
        {
            type: 'confirm',
            name: 'createSlot',
            default: false,
            message: 'Do you want to create slots?',
        },
        {
            type: 'confirm',
            name: 'createAppInsights',
            default: false,
            message: 'Do you want to create an App Insights?',
        },
        {
            type: 'confirm',
            name: 'createCDN',
            default: false,
            message: 'Do you want to create a CDN?',
        },
        {
            type: 'confirm',
            name: 'createCache',
            default: false,
            message: 'Do you want to create a Redis cache?',
        }
    ], // array of inquirer prompts
    actions: [
        {
            type: "add",
            path: "generated/{{name}}.json",
            templateFile: __dirname + "/azuredeploy.json"
        },
        {
            type: "add",
            path: "generated/{{name}}.parameters.json",
            templateFile: __dirname + "/azuredeploy.parameters.json"
        },
        {
            type: "printHelpDeployment"
        }
    ] // array of actions
};