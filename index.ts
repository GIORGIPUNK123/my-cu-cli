#!/usr/bin/env node
import { program } from 'commander';
import { mainFunc } from './src/main';

(async () => {
  program.version('1.0.0').description('Check My Cu From CLI ');

  program
    .command('info <pirn>') // Use 'info' as the command name
    .description('Get Latest Info From My Cu')
    .action(async (pirn) => {
      console.log(await mainFunc(pirn));
    });

  await program.parseAsync(process.argv);
})();
