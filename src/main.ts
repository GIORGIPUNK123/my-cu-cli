import puppeteer from 'puppeteer';
import { getBasic } from './helpers/basic_helper.js';
import { login } from './helpers/login_helper.js';

export const mainFunc = async (pirn: string, type: 'basic'): Promise<any> => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1080, height: 1024 });
    await login(page, pirn);
    await page.waitForNetworkIdle();
    await page.goto('https://programs.cu.edu.ge/students/gpa.php');
    return await getBasic(page);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  } finally {
    browser.close();
  }
};
