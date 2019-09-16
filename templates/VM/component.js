var validateRequired = require('../../validator').validateRequired;
var validateUnsignedInteger = require('../../validator').validateUnsignedInteger;


module.exports = function (plop) {
    plop.load('../../actionTypes.js');
    plop.setPrompt('recursive', require('inquirer-recursive'));
    // helpers for template generation
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
                when: function (answers) {
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
            {
                type: 'confirm',
                name: 'remoteAccess',
                default: true,
                message: 'Do you want to open remote access port?',
                when: function (answers) {
                    return answers.hasPublicIP;
                },
            },
            {
                type: 'list',
                name: 'osPublisher',
                default: 0,
                message: 'What is the OS?',
                choices: ['MicrosoftWindowsServer', 'Canonical', 'RedHat']
            },
            {
                type: 'list',
                name: 'osOffer',
                default: 0,
                message: 'What is the OS offer?',
                choices: function (answers) {
                    switch (answers.osPublisher) {
                        case 'MicrosoftWindowsServer':
                            return ['WindowsServer']
                        case 'Canonical':
                            return ['UbuntuServer']
                        case 'RedHat':
                            return ['RHEL']
                        default:
                            break;
                    }
                }
            },
            {
                type: 'list',
                name: 'osSku',
                default: 0,
                message: 'What is the OS SKU?',
                choices: function (answers) {
                    switch (answers.osOffer) {
                        case 'WindowsServer':
                            return ["2012-Datacenter",
                                "2012-R2-Datacenter",
                                "2016-Nano-Server",
                                "2016-Datacenter-with-Containers",
                                "2016-Datacenter"
                            ];

                        case 'UbuntuServer':
                            return ['14.04.5-LTS',
                                "14.04.5-LTS",
                                "15.10",
                                "16.04.0-LTS"
                            ]
                        case 'RHEL':
                            return ['7.2']
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
            },
            {
                type: 'confirm',
                name: 'hasAutoShutdown',
                default: true,
                message: 'Do you want to plan an auto-shutdown?',
            },
            {
                type: 'confirm',
                name: 'isDiagnosticsEnabled',
                default: false,
                message: 'Do you want to enable diagnostics?',
            },
            {
                type: 'confirm',
                name: 'existingStorage',
                default: false,
                message: 'Do you want to use an existing storage account?',
                when: function (answers) {
                    return answers.isDiagnosticsEnabled;
                }
            },
            {
                type: 'confirm',
                name: 'isADJoined',
                default: false,
                message: 'Do you want to join the VM to Active Directory?',
            },
            {
                type: 'confirm',
                name: 'backup',
                default: false,
                message: 'Do you want to backup the VM?',
            },
            {
                type: 'recursive',
                name: 'extensions',
                message: 'Do you want to add an extension?',
                prompts: [
                    {
                        type: 'list',
                        name: 'extensionType',
                        default: 0,
                        message: 'Which Extension?',
                        choices: ['Generic', 'CustomScript', 'DSC']
                    },
                    {
                        type: 'confirm',
                        name: 'onboardAzureAutomation',
                        default: false,
                        message: 'Do you want to onboard the VM to an Azure Automation account?',
                        when: function (answers) {
                            return "DSC" == answers.extensionType;
                        }
                    }
                ]
            }
        ], // array of inquirer prompts
        actions: function (data) {
            var actions = [];
            actions.push({
                type: "add",
                path: "generated/{{name}}.json",
                templateFile: "./azuredeploy.json"
            });
            actions.push({
                type: "add",
                path: "generated/{{name}}.parameters.json",
                templateFile: "./azuredeploy.parameters.json"
            });
            if (data.backup) {
                actions.push({
                    type: 'add',
                    path: "generated/nested/backup.json",
                    force: true,
                    templateFile: 'nested/backup.json'
                });
                actions.push({
                    type: "printHelpDeployment"
                });
                return actions;
            }
        } // end of dynamic array of actions
    });
};