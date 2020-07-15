var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;
var actionTypes = require('../../actionTypes');

module.exports.generatorName = 'DataFactory';
module.exports.generator = {
    description: 'This module generates ARM template file for a DataFactory',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the template name?',
            validate: validateRequired
        },
        {
            type: 'confirm',
            name: 'gitIntegration',
            default: false,
            message: 'Do you want to have git integration?'
        },
        {
            type: 'list',
            name: 'gitRepositoryType',
            choices: [
                {
                    name: "Azure DevOps", value: "FactoryVSTSConfiguration"
                },
                {
                    name: "GitHub", value: "FactoryGitHubConfiguration"
                }
            ],
            message: 'What kind of repository do you want?',
            when: function (answers) {
                return answers.gitIntegration;
            },
        },
    ], // array of inquirer prompts
    actions: actionTypes.DEFAULT_ACTIONS(__dirname)
};