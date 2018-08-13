var repeatHelper = require('handlebars-helper-repeat');
const chalk = require('chalk');


function validateRequired(value) {
    return value.trim() !== '';
}

module.exports = function (plop) {
    // helpers for template generation
    plop.setHelper('repeat', repeatHelper);
    plop.setHelper('is', function (arg1, arg2, opts) {
        if (arg1 == arg2) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    });
    plop.setHelper('isnot', function (arg1, arg2, opts) {
        if (arg1 != arg2) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    });
    plop.setActionType('printHelpDeployment', function (answers, config, plop) {
        // do something
        console.log(chalk.yellow('To deploy your template, use the following PowerShell cmdlet:'));
        console.log(chalk.yellow('New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroupName> -verbose -TemplateFile .\\generated\\'+answers.name+'.json -TemplateParameterFile .\\generated\\'+answers.name+'.parameters.json'));
        return '';
    });

    // Generators
    plop.load([
		'./templates/AppService/component.js',
		'./templates/DataLakeStore/component.js',
		'./templates/KeyVault/component.js',
		'./templates/SQL/component.js',
		'./templates/VM/component.js',
	]);
};
