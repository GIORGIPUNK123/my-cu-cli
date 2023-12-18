import { Page } from 'puppeteer';
import { getColumnContent } from './basic_helper.js';

export const availableSubjects = async (page: Page) => {
  let names: string[] = [];
  for (let i = 1; i < 7; i++) {
    names.push(await getColumnContent('name', i, page));
  }
  return names;
};
