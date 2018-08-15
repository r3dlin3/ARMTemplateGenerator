var repeatHelper = require('handlebars-helper-repeat');
var glob = require("glob")
const chalk = require('chalk');

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

    // Generators
    var files = glob.sync("./templates/*/component.js");
    plop.load(files);
    
};
