const chalk = require('chalk');


module.exports.DEFAULT_ACTIONS = function (path) {
    return [

        {
            type: "add",
            path: "generated/{{name}}.json",
            templateFile: path + "/azuredeploy.json"
        },
        {
            type: "add",
            path: "generated/{{name}}.parameters.json",
            templateFile: path + "/azuredeploy.parameters.json"
        },
        {
            type: "printHelpDeployment"
        }
    ]
};

module.exports.printHelpDeployment = function (answers, config, plop) {
    // do something
    console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
    console.log(chalk.yellow('1) Using AzureRM module'));
    console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    console.log(chalk.yellow('2) Using Az module'));
    console.log(chalk.yellow('New-AzResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    return '';
};
