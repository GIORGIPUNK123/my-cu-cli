#!/usr/bin/env node
import { program } from 'commander';
import { mainFunc } from './main.ts';
import select, { Separator } from '@inquirer/select';
import { input } from '@inquirer/prompts';
import { getWholeTable } from './helpers/basic_helper.ts';
import puppeteer from 'puppeteer';
import { login } from './helpers/login_helper.ts';

(async () => {
  program.version('1.0.0').description('Check My Cu From CLI ');
  program
    .command('info') // Use 'info' as the command name
    .description('Get Latest Info From My Cu')
    .action(async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      try {
        const year = await select({
          message: 'Select Year',
          choices: [
            {
              name: 'First Year',
              value: 'first',
              description: 'First Year',
            },

            {
              name: 'Upper Years',
              value: 'upper',
              description: 'Upper Years',
            },
          ],
        });
        if (year === 'first') {
          const pirn = await input({ message: 'Enter your ID Number' });
          await login(page, pirn);
        } else {
          const username = await input({ message: 'Enter your USERNAME' });
          const pass = await input({ message: 'Enter your PASSWORD' });
          await login(page, username, pass);
        }
        await page.waitForNetworkIdle();
        await page.goto('https://programs.cu.edu.ge/students/gpa.php');

        const gpaUrl = 'https://programs.cu.edu.ge/students/gpa.php';

        // Infinite loop for menu selection
        let shouldExit = false;
        while (!shouldExit) {
          // Always return to GPA page before showing choices.
          // Subject details may navigate away from this page.
          await page.goto(gpaUrl, { waitUntil: 'networkidle0' });

          const subjects = await getWholeTable(page);
          const answer = await select({
            message: 'Select',
            choices: [
              {
                name: 'basic',
                value: 'basic',
                description: 'Get basic info about your gpa and grades',
              },
              ...subjects.map((x, idx) => ({
                name: `${x.code} | ${x.name}`,
                value: `subject::${idx}::${x.code}`,
                description: 'Find more about this subject',
              })),
              new Separator(),
              {
                name: 'Exit',
                value: 'exit',
                description: 'Exit the application',
              },
            ],
          });

          if (answer === 'exit') {
            shouldExit = true;
            console.log('Goodbye!');
          } else {
            await mainFunc(page, browser, answer);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        await browser.close();
      }
    });

  await program.parseAsync(process.argv);
})();
