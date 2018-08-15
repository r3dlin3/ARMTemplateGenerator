const chalk = require('chalk');

module.exports = function (plop) {
    plop.setActionType('printHelpDeployment', function (answers, config, plop) {
        // do something
        console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
        console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\' + answers.name + '.json -TemplateParameterFile .\\generated\\' + answers.name + '.parameters.json'));
        return '';
    });

    plop.setDefaultInclude({ actionTypes: true });
}
