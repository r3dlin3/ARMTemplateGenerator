var glob = require("glob")
const chalk = require('chalk');

module.exports = function (plop) {
    // Generators
    var files = glob.sync("./templates/*/component.js");
    plop.load(files);
    
};
