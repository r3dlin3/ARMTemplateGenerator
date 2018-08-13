var validateRequired = require('../../validator').validateRequired;

module.exports = function (plop) {

plop.setGenerator('AppService', {
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
        },

    ], // array of inquirer prompts
    actions: [
        {
            type: "add",
            path: "generated/{{name}}.parameters.json",
            templateFile: "templates/AppService/azuredeploy.parameters.json"
        },
        {
            type: "add",
            path: "generated/{{name}}.json",
            templateFile: "templates/AppService/azuredeploy.json"
        },
        {
            type: "printHelpDeployment"
        }
    ]  // array of actions
});
}