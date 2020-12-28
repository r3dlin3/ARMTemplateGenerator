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
            type: 'confirm',
            name: 'isLinux',
            message: 'Do you want an App Service Plan on Linux?',
            when: function (answers) {
                return !answers.existingASP;
            },
        },
        {
            type: 'confirm',
            name: 'docker',
            default: false,
            message: 'Do you want to use a custom docker image?',
            when: function (answers) {
                return answers.isLinux;
            },
        },
        {
            type: 'confirm',
            name: 'isVnetIntegrationEnabled',
            default: false,
            message: 'Do you want to integrate your app with an Azure virtual network? It Requires a Standard, Premium, PremiumV2, PremiumV3, or Elastic Premium pricing plan.',
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