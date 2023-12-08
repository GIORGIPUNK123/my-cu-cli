import puppeteer from 'puppeteer';
import { login, get3Cols } from './helpers';

export const mainFunc = async (pirn: string): Promise<any> => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1080, height: 1024 });
    await login(page, pirn);
    await page.waitForNetworkIdle();
    await page.goto('https://programs.cu.edu.ge/students/gpa.php');
    return await get3Cols(page);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  } finally {
    browser.close();
  }
};
