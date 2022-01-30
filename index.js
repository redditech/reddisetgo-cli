#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

(async () => {
    let blockchain;
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
            message: 'Which blockchain do you want to demo? (default is `Near`',
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
        await sleep();
        if (selectedBlockchain === 'Quit') {
            spinner.error({ text: `Quitting...` });
            process.exit(1);
        }
        else {
            spinner.success({ text: `Nice. I'll prep the demos for ${selectedBlockchain}` });
            switch (selectedBlockchain) {
                case 'Near':
                    console.clear();
                    const rainbowTitle = chalkAnimation.rainbow(
                        "Starting Demos for Near..."
                    );
                    await sleep();
                    rainbowTitle.stop();
                    await demoNear();
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
    async function demoNear() {
        return;
    }
    await welcome();
    await whichBlockchain();
})();

