import { Page } from 'puppeteer';
type ColumnType = 'name' | 'credit' | 'percentage' | 'mark';

const outputBuilder = (
  data: { name: string; arr: string[]; maxLength: number }[]
) => {
  let headerArr: string[] = [];
  let rowsArr: string[][] = [];
  let resultArr: string[][] = [];
  let maxLengthArr: number[] = [];

  const stringFunc = (text: string, maxLength: number) => {
    const spacesBefore = Math.max(0, Math.floor((maxLength - text.length) / 2));
    const spacesAfter = Math.max(0, maxLength - text.length - spacesBefore);
    const buffer = Array(spacesBefore).fill(' ');
    buffer.push(text);
    buffer.push(...Array(spacesAfter).fill(' '));
    return buffer.join('');
  };

  data.forEach((x) => {
    maxLengthArr.push(x.maxLength);
  });
  data.forEach((x, i) => {
    const colName = x.name;
    const spacesBefore = Math.max(
      0,
      Math.floor((x.maxLength - colName.length) / 2)
    );
    const spacesAfter = Math.max(
      0,
      x.maxLength - colName.length - spacesBefore
    );

    headerArr.push(stringFunc(colName, maxLengthArr[i]));
    rowsArr.push(x.arr);
  });

  // Transpose the matrix
  const transposedMatrix = rowsArr[0].map((_, colIndex) =>
    rowsArr.map((row, i) => stringFunc(row[colIndex], maxLengthArr[i]))
  );

  let prettyArr: string[] = [];

  const first_buffer = [
    '┌',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┬'
        }`
    ),
    '┐',
  ];
  const prettierHeaderArr = [
    '│',
    ...maxLengthArr.map(
      (x, i) =>
        `${stringFunc(headerArr[i], x)}${
          i === maxLengthArr.length - 1 ? '' : '│'
        }`
    ),
    '│',
  ];
  const bottom_buffer = [
    '└',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┴'
        }`
    ),
    '┘',
  ];
  const infoPart = transposedMatrix.map((x, _) => {
    return [
      '│',
      ...maxLengthArr.map(
        (x, i) =>
          `${stringFunc(transposedMatrix[_][i], x)}${
            i === maxLengthArr.length - 1 ? '' : '│'
          }`
      ),
      '│',
    ];
  });
  const middlePart = [
    '├',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┼'
        }`
    ),
    '┤',
  ];
  prettyArr.push(first_buffer.join(''));
  prettyArr.push(prettierHeaderArr.join(''));
  prettyArr.push(middlePart.join(''));
  transposedMatrix.forEach((_, __) => {
    prettyArr.push(infoPart[__].join(''));
    __ !== transposedMatrix.length - 1
      ? prettyArr.push(middlePart.join(''))
      : prettyArr.push(bottom_buffer.join(''));
  });
  prettyArr.forEach((x) => {
    console.log(x);
  });
};

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
  const rowSelector = type === 'name' ? rowNumber + 1 : rowNumber + 1;
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

export const get4Cols = async (
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

  const checkArrayContent = (arr: string[]): number => {
    return arr.reduce((maxLength, item) => {
      return Math.max(maxLength, item.length);
    }, 0);
  };
  const namesLongest = checkArrayContent(namesContentArr);
  const creditsLongest = checkArrayContent(creditsContentArr);
  const percentagesLongest = checkArrayContent(percentagesContentArr);
  const marksLongest = checkArrayContent(marksContentArr);
  const finishedArr = [
    {
      name: 'names',
      arr: namesContentArr,
      maxLength: 'names'.length < namesLongest ? namesLongest : 'names'.length,
    },
    {
      name: 'credits',
      arr: creditsContentArr,
      maxLength:
        'names'.length < creditsLongest ? creditsLongest : 'credits'.length,
    },
    {
      name: 'percentages',
      arr: percentagesContentArr,
      maxLength:
        'percentages'.length < percentagesLongest
          ? percentagesLongest
          : 'percentages'.length,
    },
    {
      name: 'marks',
      arr: marksContentArr,
      maxLength: 'marks'.length < marksLongest ? marksLongest : 'marks'.length,
    },
  ].map((x) => {
    return x;
  });

  outputBuilder(finishedArr);
  // console.log(Array(longestLength).fill('-').join(''));
  return finishedArr;
};
