import puppeteer, { Browser, Page } from 'puppeteer';
import { getBasic } from './helpers/basic_helper.js';
import { login } from './helpers/login_helper.js';
import { subjectDetails } from './helpers/subject_details.js';

export const mainFunc = async (
  page: Page,
  browser: Browser,
  pirn: string,
  type: 'basic' | string
): Promise<any> => {
  try {
    await page.setViewport({ width: 1080, height: 1024 });
    type === 'basic' ? await getBasic(page) : await subjectDetails(page, type);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  } finally {
    await browser.close();
  }
};
