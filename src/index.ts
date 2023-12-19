#!/usr/bin/env node
import { program } from 'commander';
import { mainFunc } from './main.js';
import select, { Separator } from '@inquirer/select';
import { input } from '@inquirer/prompts';
import { availableSubjects } from './helpers/check_data.js';
import puppeteer from 'puppeteer';
import { login } from './helpers/login_helper.js';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  program.version('1.0.0').description('Check My Cu From CLI ');
  program
    .command('info') // Use 'info' as the command name
    .description('Get Latest Info From My Cu')
    .action(async () => {
      const pirn = await input({ message: 'Enter your ID NUMBER' });
      await login(page, pirn);
      await page.waitForNetworkIdle();
      await page.goto('https://programs.cu.edu.ge/students/gpa.php');
      await availableSubjects(page);
      const answer = await select({
        message: 'Select',
        choices: [
          {
            name: 'basic',
            value: 'basic',
            description: 'Get basic info about your gpa and grades',
          },
          ...(await (async () => {
            const subjects = await availableSubjects(page);
            return subjects.map((x) => ({
              name: x,
              value: x,
              description: 'Find more about this subject',
            }));
          })()),
        ],
      });
      await mainFunc(page, browser, pirn, answer);
      // await browser.close();
    });

  await program.parseAsync(process.argv);
})();
