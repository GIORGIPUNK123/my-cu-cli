import puppeteer, { Browser, Page } from 'puppeteer';
import { getBasic } from './helpers/basic_helper.ts';
import { subjectDetails } from './helpers/subject_details.ts';
import { schedule } from './helpers/schedule.ts';

export const mainFunc = async (
  page: Page,
  browser: Browser,
  type: 'basic' | 'schedule' | string,
): Promise<any> => {
  try {
    await page.setViewport({ width: 1080, height: 1024 });
    switch (type) {
      case 'basic':
        await getBasic(page);
        break;
      case 'schedule':
        await schedule(page);
        break;
      default:
        await subjectDetails(page, type);
        break;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};
