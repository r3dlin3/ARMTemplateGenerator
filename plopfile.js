var glob = require("glob")
const chalk = require('chalk');



module.exports = function (plop) {

    ///////////////////////////////////
    // Action types
    ///////////////////////////////////
    plop.setActionType('printHelpDeployment', require('./actionTypes.js').printHelpDeployment);
    
    ///////////////////////////////////
    // Prompts
    ///////////////////////////////////
    plop.setPrompt('recursive', require('inquirer-recursive'));
    
    ///////////////////////////////////
    // helpers for template generation
    ///////////////////////////////////
    plop.setHelper('repeat', require('handlebars-helper-repeat'));
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
    
    ///////////////////////////////////
    // Generators
    ///////////////////////////////////
    var files = glob.sync("./templates/*/component.js");
    files.forEach(file=>{
        var generator = require(file);
        plop.setGenerator(generator.generatorName,generator.generator);
    });
    
};
