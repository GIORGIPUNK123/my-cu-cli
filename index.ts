#!/usr/bin/env node
import { program } from 'commander';
import { mainFunc } from './src/main.js';
import inquirer from 'inquirer';
import select, { Separator } from '@inquirer/select';
import { input } from '@inquirer/prompts';

(async () => {
  program.version('1.0.0').description('Check My Cu From CLI ');

  program
    .command('info') // Use 'info' as the command name
    .description('Get Latest Info From My Cu')
    .action(async () => {
      // console.log(
      const pirn = await input({ message: 'Enter your ID NUMBER' });
      (await select({
        message: 'Select action',
        choices: [
          {
            name: 'basic',
            value: 'basic',
            description: 'Get basic info about your gpa and grades',
          },
        ],
      })) === 'basic'
        ? await mainFunc(pirn, 'basic')
        : null;
      // );
    });

  await program.parseAsync(process.argv);
})();
