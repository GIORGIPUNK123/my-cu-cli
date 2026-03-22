#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { program } from 'commander';
import { mainFunc } from "./main.js";
import select from '@inquirer/select';
import { input } from '@inquirer/prompts';
import { availableSubjects } from "./helpers/check_data.js";
import puppeteer from 'puppeteer';
import { login } from "./helpers/login_helper.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    program.version('1.0.0').description('Check My Cu From CLI ');
    program
        .command('info') // Use 'info' as the command name
        .description('Get Latest Info From My Cu')
        .action(() => __awaiter(void 0, void 0, void 0, function* () {
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        try {
            const year = yield select({
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
                const pirn = yield input({ message: 'Enter your ID Number' });
                yield login(page, pirn);
            }
            else {
                const username = yield input({ message: 'Enter your USERNAME' });
                const pass = yield input({ message: 'Enter your PASSWORD' });
                yield login(page, username, pass);
            }
            yield page.waitForNetworkIdle();
            yield page.goto('https://programs.cu.edu.ge/students/gpa.php');
            yield availableSubjects(page);
            const answer = yield select({
                message: 'Select',
                choices: [
                    {
                        name: 'basic',
                        value: 'basic',
                        description: 'Get basic info about your gpa and grades',
                    },
                    ...(yield (() => __awaiter(void 0, void 0, void 0, function* () {
                        const subjects = yield availableSubjects(page);
                        return subjects.map((x) => ({
                            name: x,
                            value: x,
                            description: 'Find more about this subject',
                        }));
                    }))()),
                ],
            });
            yield mainFunc(page, browser, answer);
        }
        catch (error) {
            console.error('Error:', error);
            yield browser.close();
        }
    }));
    yield program.parseAsync(process.argv);
}))();
