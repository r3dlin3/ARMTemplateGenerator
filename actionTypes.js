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

    console.log(chalk.yellow('To deploy your template, use:'));
    console.log(chalk.yellow('1) the following PowerShell cmdlet:'));
    console.log(chalk.yellow('\t1) Using AzureRM module'));
    console.log(chalk.yellow('\tNew-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    console.log(chalk.yellow('\t2) Using Az module'));
    console.log(chalk.yellow('\tNew-AzResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
    console.log(chalk.yellow('2) the Az CLI :'));
    console.log(chalk.yellow('az deployment group create --resource-group <ResourceGroupName> --template-file .\\generated\\' + answers.name + '.json --parameters @.\\generated\\' + answers.name + '.parameters.json'));

    return '';
};
