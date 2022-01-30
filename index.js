#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { exec } from 'child_process';
import util from 'util';

(async () => {
    let blockchain;
    let demo;
    const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
    async function welcome() {
        figlet(`ReddiSetGo CLI V 0.1`, (err, data) => {
            console.log(gradient.instagram.multiline(data) + '\n');
        });
        await sleep();
    }
    async function whichBlockchain() {
        const answers = await inquirer.prompt({
            name: 'blockchain',
            type: 'list',
            message: 'Which blockchain do you want to demo? (default is `Near`)',
            choices: ['Ethereum', 'Solana', 'Near', 'Quit'],
            default() {
                return 'Near';
            },
        });
        blockchain = answers.blockchain;
        demoBlockchain(blockchain);
    }
    async function demoBlockchain(selectedBlockchain) {
        const spinner = createSpinner('Prepping demo...').start();
        if (selectedBlockchain === 'Quit') {
            spinner.error({ text: `Quitting...` });
            process.exit(1);
        }
        else {
            await sleep();
            spinner.success({ text: `Nice. I'll prep the demos for ${selectedBlockchain}` });
            switch (selectedBlockchain) {
                case 'Near':
                    console.clear();
                    await confirmNearCli() ? await demoNear() : await installNearCli();
                    break;
                case 'Ethereum':
                    console.log(chalk.red('Still a todo for Ethereum demos'));
                    break;
                default:
                    console.log(chalk.blue('Work in progress'));
                    break;
            }
        }
        console.log(chalk.bgGreen(`Returning to menu`));
        await whichBlockchain();
    }
    async function confirmNearCli() {

        console.log(`I will be executing the following command: ${chalk.blue('near --version')}`);
        // Reference https://stackabuse.com/executing-shell-commands-with-node-js/
        // Reference https://zaiste.net/posts/nodejs-child-process-spawn-exec-fork-async-await/
        const _exec = util.promisify(exec);
        const rainbowTitle = chalkAnimation.radar(
            "Checking for the Near CLI..."
        );
        try {
            let { stdout, stderr, error } = await _exec("near --version");
            if (error) {
                console.log(`error: ${error.message}`);
                return false;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return false;
            }
            console.log(stdout);
        }
        catch (error) {
            console.log(`error: ${error.message}`);
            return false;
        }

        console.log("The Near CLI is already installed");
        return true;
    }

    async function installNearCli() {
        console.log("The Near CLI is not installed. I will install it now");
        console.log(`I will be executing the following command: ${chalk.blue('npm i -g near-cli')}`);
        const _exec = util.promisify(exec);
        try {
            let { stdout, stderr, error } = await _exec("npm i -g near-cli");
            if (error) {
                console.log(`error: ${error.message}`);
                return false;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                if (stderr.includes("npm ERR!"))
                    return false; // This is as `npm WARN` also triggers an error but isn't a fail
                else {
                    console.log(`stdout: ${stdout}`);
                    console.log("The Near CLI has been installed, please try re-running the demo");

                    return true;
                }
            }
            console.log(`stdout: ${stdout}`);
            console.log("The Near CLI has been installed, please try re-running the demo");
            rainbowTitle.stop();
        }
        catch (error) {
            console.log(`error: ${error.message}`);
            return false;
        }

        return true;
    }
    async function demoNear() {
        const rainbowTitle = chalkAnimation.rainbow(
            "Starting Demos for Near..."
        );
        await sleep();
        rainbowTitle.stop();
        const answers = await inquirer.prompt({
            name: 'near_demo',
            type: 'list',
            message: 'Which demo? Default is `Quit`',
            choices: ['Login', 'Deploy Contract', 'Quit'],
            default() {
                return 'Quit';
            },
        });
        demo = answers.near_demo;
        switch (demo) {
            case 'Login':
                console.clear();
                const rainbowTitle = chalkAnimation.rainbow(
                    "Starting Login Demo for Near..."
                );
                await sleep();
                rainbowTitle.stop();
                demoNearLogin();
                break;
            default:
                console.log(chalk.blue('Work in progress'));
                break;
        }

    }
    async function demoNearLogin() {
        console.log(`This is following docs at 
                    ${chalk.green('https://docs.near.org/docs/tools/near-cli#near-login'
        )}`);
    }
    await welcome();
    await whichBlockchain();
})();

