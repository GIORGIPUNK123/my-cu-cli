import puppeteer, { Browser, Page } from 'puppeteer';
import { getBasic } from './helpers/basic_helper.ts';
import { subjectDetails } from './helpers/subject_details.ts';

export const mainFunc = async (
  page: Page,
  browser: Browser,
  type: 'basic' | string,
): Promise<any> => {
  try {
    await page.setViewport({ width: 1080, height: 1024 });
    type === 'basic' ? await getBasic(page) : await subjectDetails(page, type);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};
