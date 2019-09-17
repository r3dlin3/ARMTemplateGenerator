var validateRequired = require('../../validator').validateRequired;
const chalk = require('chalk');

module.exports.generatorName = require('path').basename(__dirname);
module.exports.generator = {
    description: 'This module generates ARM template file for a Data Lake Store',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'createFirewallRules',
            default: true,
            message: 'Do you want to create firewall rules?'
        },
        {
            type: 'confirm',
            name: 'useKeyVault',
            default: true,
            message: 'Do you want to use a Key Vault for encryption?'
        }
    ], // array of inquirer prompts
    actions: [
        {
            type: "add",
            path: "generated/{{name}}.parameters.json",
            templateFile: __dirname + "/azuredeploy.parameters.json"
        },
        {
            type: "add",
            path: "generated/{{name}}.json",
            templateFile: __dirname + "/azuredeploy.json"
        },
        {
            type: "printHelpDeployment"
        }
    ]  // array of actions
};