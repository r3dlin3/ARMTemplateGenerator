var validateRequired = require('../../validator').validateRequired;
var actionTypes = require('../../actionTypes');

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
            type: 'list',
            name: 'kind',
            choices: [{
                name: "Windows", value: "app"
            }, {
                name: "Linux", value: "linux"
            }
            ],
            message: 'What kind of App Service Plan do you want?',
            when: function (answers) {
                return !answers.existingASP;
            },
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
        {
            type: 'confirm',
            name: 'enableManagedIdentity',
            default: false,
            message: 'Do you want a system-assigned managed identity on the App Service?',
        }
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};