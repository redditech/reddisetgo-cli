#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';

(async () => {
    let blockchain;
    const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
    async function welcome() {
        const rainbowTitle = chalkAnimation.rainbow(
            "Welcome to reddisetgo-cli demos"
            );
        await sleep();
        rainbowTitle.stop();

        console.log(`
            ${chalk.bgBlue('DEMOS AVAILABLE')}
            I am a process on your computer.
            Choose the demo to run and I will execute it
        `);
        await sleep();
    }
    async function whichBlockchain(){
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
    async function demoBlockchain(selectedBlockchain){
        const spinner = createSpinner('Prepping demo...').start();
        await sleep();
        if (selectedBlockchain==='Quit'){
            spinner.error({text: `Quitting...`});
            process.exit(1);
        }
        else {
            spinner.success({text: `Nice. I'll prep the demos for ${selectedBlockchain}`});
        }
        console.log(chalk.bgGreen(`Returning to menu`));
        await whichBlockchain();
    }
    await welcome();
    await whichBlockchain();
})()

