import { Page } from 'puppeteer';
type ColumnType = 'name' | 'credit' | 'percentage' | 'mark';
export const login = async (page: any, pirn: string) => {
  await page.goto('https://programs.cu.edu.ge/cu/loginStud');
  await Promise.all([
    page.waitForSelector('button[name="submit"]'),
    page.waitForSelector('input[name="pirn"]'),
    page.waitForSelector('input[name="username"]'),
    page.waitForSelector('input[name="password"]'),
  ]);
  const myPirn = pirn.split('');
  await page.type('input[name="pirn"]', myPirn.slice(0, -1));
  await page.waitForNetworkIdle();
  await page.type('input[name="pirn"]', myPirn.slice(-1));
  await page.type('input[name="password"]', myPirn);
  await page.waitForNetworkIdle();
  await page.click('button[name=submit]');
};

const sbjString = (type: ColumnType, rowNumber: number) => {
  const baseSelector =
    'body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody';
  const rowSelector = type === 'name' ? rowNumber : rowNumber + 1;
  const columnSelector =
    type === 'name'
      ? 3
      : type === 'credit'
      ? 4
      : type === 'percentage'
      ? 9
      : 10;
  const inputSelector = type === 'percentage' ? ' > input[type=text]' : '';

  return `${baseSelector} > tr:nth-child(${rowSelector}) > td:nth-child(${columnSelector})${inputSelector}`;
};

// percentage = `body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(${2}) > td:nth-child(9) > input[type=text]`;
// 'body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(9) > input[type=text]';
export const get3Cols = async (
  page: Page
): Promise<{ name: string; arr: string[] }[]> => {
  const getColumnContent = async (
    type: ColumnType,
    index: number
  ): Promise<string> => {
    const selector = sbjString(type, index);
    const element = await page.evaluate(
      (sbjSelector: any, type: ColumnType) => {
        return type !== 'percentage'
          ? document.querySelector(sbjSelector)?.textContent || ''
          : document.querySelector(sbjSelector)?.value || '';
      },
      selector,
      type
    );
    return element;
  };
  let namesContentArr: string[] = [];
  let creditsContentArr: string[] = [];
  let percentagesContentArr: string[] = [];
  let marksContentArr: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const nameContent = await getColumnContent('name', i);
    const creditContent = await getColumnContent('credit', i);
    const percentageContent = await getColumnContent('percentage', i);
    const markContent = await getColumnContent('mark', i);
    namesContentArr.push(nameContent);
    creditsContentArr.push(creditContent);
    percentagesContentArr.push(percentageContent);
    marksContentArr.push(markContent);
  }
  return [
    { name: 'names', arr: namesContentArr },
    { name: 'credits', arr: creditsContentArr },
    { name: 'percentages', arr: percentagesContentArr },
    { name: 'marks', arr: marksContentArr },
  ];
};

// export const getPercentages = async (page: Page) => {
//   // document.querySelector(
//   // );
//   // document.querySelector(
//   `body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(${2}) > td:nth-child(9) > input[type=text]`;
//   // );

//   };
// };
