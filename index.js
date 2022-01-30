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
    let near_env = process.env.NEAR_ENV;
    let near_account;
    const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
    const welcome = async () => {
        figlet(`ReddiSetGo CLI V 0.1`, (err, data) => {
            console.log(gradient.instagram.multiline(data) + '\n');
        });
        await sleep(500);
    }
    const whichBlockchain = async () => {
        const answers = await inquirer.prompt({
            name: 'blockchain',
            type: 'list',
            message: 'Which blockchain do you want to demo? (default is `Near`)',
            choices: ['Near', 'Solana', 'Ethereum', 'Quit'],
            default() {
                return 'Near';
            },
        });
        blockchain = answers.blockchain;
        demoBlockchain(blockchain);
    }
    const demoBlockchain = async (selectedBlockchain) => {
        const spinner = createSpinner('Prepping demo...').start();
        if (selectedBlockchain === 'Quit') {
            spinner.error({ text: `Quitting...` });
            process.exit(1);
        }
        else {
            await sleep(500);
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
    const confirmNearCli = async () => {

        console.log(`I will be executing the following command: ${chalk.blue('near --version')}`);
        // Reference https://stackabuse.com/executing-shell-commands-with-node-js/
        // Reference https://zaiste.net/posts/nodejs-child-process-spawn-exec-fork-async-await/
        // Reference https://stackoverflow.com/questions/34622560/node-child-process-exec-command-failed-with-error-code-1
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

        figlet(`Near CLI Is Installed! Yay!`, (err, data) => {
            console.log(gradient.instagram.multiline(data) + '\n');
        });
        console.log("The Near CLI is already installed");
        return true;
    }

    const installNearCli = async () => {
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
            figlet(`Near CLI Installation Complete`, (err, data) => {
                console.log(gradient.instagram.multiline(data) + '\n');
            });
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
        await sleep(500);
        rainbowTitle.stop();
        const answers = await inquirer.prompt({
            name: 'near_demo',
            type: 'list',
            message: 'Which demo? Default is `Login`',
            choices: ['Login', 'List Access Keys', 'Create Sub-Account and Transfer Tokens', 'Quit'],
            default() {
                return 'Login';
            },
        });
        demo = answers.near_demo;
        switch (demo) {
            case 'Login':
                console.clear();
                const rainbowTitle = chalkAnimation.rainbow(
                    "Starting Login Demo for Near..."
                );
                await sleep(500);
                rainbowTitle.stop();
                await nearLoginTestnet();
                break;
            case 'List Access Keys':
                await listNearKeys();
                break;
            case 'Quit':
                console.log("Quitting...");
                process.exit(0);
            default:
                console.log(chalk.blue('Work in progress'));
                await demoNear();
                break;
        }

    }
    const setNearTestnet = async () => {
        console.log(`Current near environment set to ${near_env}`);
        if (near_env === "testnet") return true;

        console.log(`First I will set the target to Near's 'testnet' with ${chalk.blue('NEAR_ENV=testnet')}`);
        process.env['NEAR_ENV'] = 'testnet';
        near_env = process.env.NEAR_ENV;
        console.log(`Current near environment is now set to ${near_env}`);
        if (near_env !== "testnet") return false;
        return true;
    }

    const nearLoginTestnet = async () => {
        console.log(`This is following docs at 
                    ${chalk.green('https://docs.near.org/docs/tools/near-cli#near-login'
        )}`);
        if (!await setNearTestnet()) {
            console.log("Couldn't set the Near environment to testnet");
            return false;
        }
        const _exec = util.promisify(exec);
        try {
            console.log(`I will be executing the following command: ${chalk.blue('near login')}`);
            console.log('This should open a browser window for you to authenticate your credentials');
            let { stdout, stderr, error } = await _exec("near login");
            if (error) {
                console.log(`error: ${error.message}`);
                return false;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                return false;
            }
            console.log(`stdout: ${stdout}`);
            console.log("-------------------");

            // Reference https://regex101.com/
            // Reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet
            near_account = stdout.match(/[A-Za-z0-9_-]*.testnet\s/gm).toString().trim();
        }
        catch (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        figlet(`Login to Near Testnet Complete`, (err, data) => {
            console.log(gradient.instagram.multiline(data) + '\n');
        });

        console.log(`Your logged in Near account is set to ${near_account}`);
        return true;

    }
    const listNearKeys = async () => {
        if (!near_account) {
            console.log("You need to run the `Login` demo first to login to your Near Testnet account");
            await nearLoginTestnet();
            await listNearKeys();
            return;
        }
        else {
            console.log(`This is following docs at 
                    ${chalk.green('https://docs.near.org/docs/tools/near-cli#near-keys'
            )}`);
            console.log(`I will run '${chalk.blue("near keys " + near_account)}' to generate the list of keys for your account`);
            const _exec = util.promisify(exec);
            try {
                console.log(`I will be executing the following command: ${chalk.blue('near keys ' + near_account)}`);
                let { stdout, stderr, error } = await _exec(`near keys ${near_account}`);
                if (error) {
                    console.log(`error: ${error.message}`);
                    return false;
                }
                if (stderr) {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    return false;
                }
                console.log(`${stdout}`);
                console.log("-------------------");
            }
            catch (error) {
                console.log(`error: ${error.message}`);
                return false;
            }
            figlet(`Listing Near Account Keys Complete`, (err, data) => {
                console.log(gradient.instagram.multiline(data) + '\n');
            });
            return true;
        }
        return;
    }
    const demoBalanceTransfer = async (fromAccount, toAccount, amount) => {

    }
    await welcome();
    await demoNear();
    await whichBlockchain();
})();

