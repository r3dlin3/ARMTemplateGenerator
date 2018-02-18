var repeatHelper = require('handlebars-helper-repeat');


function validateRequired(value) {
    return value.trim() !== '';
}

function validateUnsignedInteger(value) {
    var reg = /^\d+$/;
    return reg.test(value);
}

module.exports = function (plop) {
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
    // create your generators here
    plop.setGenerator('VM', {
        description: 'This module generates ARM template file for a VM',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the template name?',
                validate: validateRequired
            },            
            {
                type: 'confirm',
                name: 'existingVNET',
                default: true,
                message: 'Do you want to use an existing VNET?'
            },
            {
                type: 'confirm',
                name: 'existingSubnet',
                default: true,
                when: function( answers ) {
                    return answers.existingVNET;
                  },
                message: 'Do you want to use an existing subnet?',
                validate: validateRequired
            },
            {
                type: 'list',
                name: 'privateIPtype',
                default: "Static",
                message: 'Do you want to use a private IP address dynamic or static?',
                choices: ["Static", "Dynamic"],
            },
            {
                type: 'confirm',
                name: 'hasPublicIP',
                default: true,
                message: 'Do you want to use a public IP address?'
            },
            {
                type: 'list',
                name: 'publicIPtype',
                default: "Dynamic",
                message: 'Do you want to use a public IP address dynamic or static?',
                choices: ["Static", "Dynamic"],
                when: function (answers) {
                    return answers.hasPublicIP;
                },
            },
            /*
            {
                type: 'confirm',
                name: 'remoteAccess',
                default: true,
                message: 'Do you want to open remote access port?',
                when: function( answers ) {
                    return answers.hasPublicIP;
                },
            },*/
            {
                type: 'list',
                name: 'osPublisher',
                default: 0,
                message: 'What is the OS?',
                choices: ['MicrosoftWindowsServer', 'Canonical']
            },
            {
                type: 'list',
                name: 'osOffer',
                default: 0,
                message: 'What is the OS offer?',
                choices: function(answers) {
                    switch (answers.osPublisher) {
                        case 'MicrosoftWindowsServer':
                            return  ['WindowsServer']
                        case 'Canonical':
                            return ['UbuntuServer']
                        default:
                            break;
                    }
                }
            },
            {
                type: 'list',
                name: 'osSku ',
                default: 0,
                message: 'What is the OS SKU?',
                choices: function(answers) {
                    switch (answers.osOffer) {
                        case 'WindowsServer':
                            return ["2012-Datacenter",
                            "2012-R2-Datacenter",
                            "2016-Nano-Server",
                            "2016-Datacenter-with-Containers",
                            "2016-Datacenter"];
                            
                        case 'UbuntuServer':
                            return ['14.04.5-LTS',
                            "14.04.5-LTS",
                            "15.10",
                            "16.04.0-LTS"]
                        default:
                            break;
                    }
                }
            },
            {
                type: 'input',
                name: 'nbDataDisk',
                default: 2,
                message: 'How many data disk?',
                validate: validateUnsignedInteger
            }/*,
            {
                type: 'list',
                name: 'storageAccountType',
                default: 0,
                message: 'Which Storage Account?',
                choices: ['Standard_LRS', 'Standard_GRS'],
                when: function (answers) {
                    return Number(answers.nbDataDisk) > 0;
                }
            },*/

        ], // array of inquirer prompts
        actions: [
            {
                type: "add",
                path: "generated/{{camelCase name}}.parameters.json",
                templateFile: "templates/VM/azuredeploy.parameters.json"
            },
            {
                type: "add",
                path: "generated/{{camelCase name}}.json",
                templateFile: "templates/VM/azuredeploy.json"
            },

        ]  // array of actions
    });
};
