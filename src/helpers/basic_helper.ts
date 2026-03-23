import { Page } from 'puppeteer';
type ColumnType = 'name' | 'credit' | 'percentage' | 'mark';

const calculateGpa = async (page: Page) => {
  await page.waitForSelector('form[name="form1"] input');
  await page.click('form[name="form1"] input');
  await page.waitForNetworkIdle();

  const result = await page.$$eval('table tbody tr table tbody tr', (rows) => {
    let newArr: { name: string; first: string; second: string }[] = [];

    rows.slice(1).forEach((row) => {
      const columns = row.querySelectorAll('td');
      const tdLength = columns.length;

      if (tdLength === 3) {
        const name = columns[0].textContent?.trim() || '';
        const firstGpa = columns[1].querySelector(
          'input[name="wpr"]',
        ) as HTMLInputElement;
        const secondGpa = columns[2].querySelector(
          'input[name="wgpa"]',
        ) as HTMLInputElement;
        newArr.push({
          name: name,
          first: firstGpa?.value || '',
          second: secondGpa?.value || '',
        });
      }
    });
    console.log('newArr gpas: ', newArr);
    return newArr;
  });

  return result;

  // const wgpaValue = await page
  //   .$eval('input[name="wgpa"]', (el) => (el as HTMLInputElement).value)
  //   .catch(() => 'null');
  // return wgpaValue;
};

export const outputBuilder = (
  data: { name: string; arr: string[]; maxLength: number }[],
  gpa?: { name: string; first: string; second: string }[],
) => {
  let headerArr: string[] = [];
  let rowsArr: string[][] = [];
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
      Math.floor((x.maxLength - colName.length) / 2),
    );

    headerArr.push(stringFunc(colName, maxLengthArr[i]));
    rowsArr.push(x.arr);
  });

  // Transpose the matrix
  const transposedMatrix = rowsArr[0].map((_, colIndex) =>
    rowsArr.map((row, i) => stringFunc(row[colIndex], maxLengthArr[i])),
  );

  let prettyArr: string[] = [];

  const first_buffer = [
    '┌',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┬'
        }`,
    ),
    '┐',
  ];
  const prettierHeaderArr = [
    '│',
    ...maxLengthArr.map(
      (x, i) =>
        `${stringFunc(headerArr[i], x)}${
          i === maxLengthArr.length - 1 ? '' : '│'
        }`,
    ),
    '│',
  ];
  const bottom_buffer = [
    '└',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┴'
        }`,
    ),
    '┘',
  ];
  const middlePart = [
    '├',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┼'
        }`,
    ),
    '┤',
  ];
  const blocks: string[][][] = [];
  let currentBlock: string[][] = [];

  transposedMatrix.forEach((row, rowIndex) => {
    currentBlock.push(row);
    const hasKumulaciuri = row.some((cell) => cell.includes('კუმულაციური'));
    const isLastRow = rowIndex === transposedMatrix.length - 1;
    if (hasKumulaciuri && !isLastRow) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  blocks.forEach((blockRows, blockIndex) => {
    prettyArr.push(first_buffer.join(''));
    prettyArr.push(prettierHeaderArr.join(''));
    prettyArr.push(middlePart.join(''));

    blockRows.forEach((row, rowIndex) => {
      const rowPart = [
        '│',
        ...maxLengthArr.map(
          (x, i) =>
            `${stringFunc(row[i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`,
        ),
        '│',
      ];

      prettyArr.push(rowPart.join(''));
      if (rowIndex !== blockRows.length - 1) {
        prettyArr.push(middlePart.join(''));
      } else {
        prettyArr.push(bottom_buffer.join(''));
      }
    });

    if (blockIndex !== blocks.length - 1) {
      prettyArr.push('');
    }
  });
  prettyArr.forEach((x) => {
    console.log(x);
  });

  // Format GPA table
  if (gpa && gpa.length > 0) {
    console.log('\n'); // Add spacing
    const gpaHeaderArr = ['Name', 'First', 'Second'];
    const gpaRowsArr = gpa.map((item) => [item.name, item.first, item.second]);
    const gpaMaxLengths = [
      Math.max(
        gpaHeaderArr[0].length,
        ...gpaRowsArr.map((row) => row[0].length),
      ),
      Math.max(
        gpaHeaderArr[1].length,
        ...gpaRowsArr.map((row) => row[1].length),
      ),
      Math.max(
        gpaHeaderArr[2].length,
        ...gpaRowsArr.map((row) => row[2].length),
      ),
    ];

    const stringFunc = (text: string, maxLength: number) => {
      const spacesBefore = Math.max(
        0,
        Math.floor((maxLength - text.length) / 2),
      );
      const spacesAfter = Math.max(0, maxLength - text.length - spacesBefore);
      const buffer = Array(spacesBefore).fill(' ');
      buffer.push(text);
      buffer.push(...Array(spacesAfter).fill(' '));
      return buffer.join('');
    };

    // GPA table borders
    const gpaFirstBuffer = [
      '┌',
      ...gpaMaxLengths.map(
        (x, i) =>
          `${Array(x).fill('─').join('')}${
            i === gpaMaxLengths.length - 1 ? '' : '┬'
          }`,
      ),
      '┐',
    ].join('');

    const gpaHeaderRow = [
      '│',
      ...gpaMaxLengths.map(
        (x, i) =>
          `${stringFunc(gpaHeaderArr[i], x)}${
            i === gpaMaxLengths.length - 1 ? '' : '│'
          }`,
      ),
      '│',
    ].join('');

    const gpaMiddleBuffer = [
      '├',
      ...gpaMaxLengths.map(
        (x, i) =>
          `${Array(x).fill('─').join('')}${
            i === gpaMaxLengths.length - 1 ? '' : '┼'
          }`,
      ),
      '┤',
    ].join('');

    const gpaBottomBuffer = [
      '└',
      ...gpaMaxLengths.map(
        (x, i) =>
          `${Array(x).fill('─').join('')}${
            i === gpaMaxLengths.length - 1 ? '' : '┴'
          }`,
      ),
      '┘',
    ].join('');

    const gpaBlocks: string[][][] = [];
    let currentBlock: string[][] = [];

    gpaRowsArr.forEach((row, rowIndex) => {
      currentBlock.push(row);
      const isLastRow = rowIndex === gpaRowsArr.length - 1;
      if (row[0].includes('კუმულაციური') && !isLastRow) {
        gpaBlocks.push(currentBlock);
        currentBlock = [];
      }
    });

    if (currentBlock.length > 0) {
      gpaBlocks.push(currentBlock);
    }

    gpaBlocks.forEach((blockRows, blockIndex) => {
      console.log(gpaFirstBuffer);

      if (blockIndex === 0) {
        console.log(gpaHeaderRow);
        console.log(gpaMiddleBuffer);
      }

      blockRows.forEach((row, idx) => {
        const rowStr = [
          '│',
          ...gpaMaxLengths.map(
            (x, i) =>
              `${stringFunc(row[i], x)}${
                i === gpaMaxLengths.length - 1 ? '' : '│'
              }`,
          ),
          '│',
        ].join('');
        console.log(rowStr);
        if (idx !== blockRows.length - 1) {
          console.log(gpaMiddleBuffer);
        }
      });

      console.log(gpaBottomBuffer);
    });
  }
};

export const sbjString = (type: ColumnType, rowNumber: number) => {
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

export const getColumnContent = async (
  type: ColumnType,
  index: number,
  page: Page,
): Promise<string> => {
  const selector = sbjString(type, index);
  const element = await page.evaluate(
    (sbjSelector: any, type: ColumnType) => {
      return type !== 'percentage'
        ? document.querySelector(sbjSelector)?.textContent || ''
        : document.querySelector(sbjSelector)?.value || '';
    },
    selector,
    type,
  );
  return element;
};
export const getWholeTable = async (page: Page) => {
  const result = await page.$$eval('table tbody tr table tbody tr', (rows) => {
    let newArr: {
      name: string;
      year: string;
      code: string;
      credit: string;
      percentage: string;
      mark: string;
    }[] = [];

    rows.slice(1).forEach((row) => {
      const columns = row.querySelectorAll('td');
      const hasInput = columns[0].querySelector('input');

      if (hasInput) {
        newArr.push({
          year: columns[0].querySelector('input')?.value || '',
          code:
            (
              columns[1]?.querySelector(
                'input[type="submit"]',
              ) as HTMLInputElement
            )?.value || 'NOT FOUND',
          name: columns[2]?.textContent?.trim() || '',
          credit: columns[3]?.textContent?.trim() || '',
          percentage: columns[4].querySelector('input')?.value || '',
          mark: columns[5]?.textContent?.trim() || '',
        });
      }
    });

    return newArr;
  });

  return result;
};

export const getAvailableSubjects = async (page: Page): Promise<string[]> => {
  const table = await getWholeTable(page);
  return table.map((row) => row.name);
};

export const availableSubjects = getAvailableSubjects;
export const getMaximumLength = (arr: string[]): number => {
  return arr.reduce((maxLength, item) => {
    return Math.max(maxLength, item.length);
  }, 0);
};
export const getBasic = async (
  page: Page,
): Promise<{ name: string; arr: string[] }[]> => {
  const tableData = await getWholeTable(page);
  const columnConfig: Array<{
    name: string;
    key: 'year' | 'code' | 'name' | 'credit' | 'percentage' | 'mark';
  }> = [
    { name: 'years', key: 'year' },
    { name: 'codes', key: 'code' },
    { name: 'names', key: 'name' },
    { name: 'credits', key: 'credit' },
    { name: 'percentages', key: 'percentage' },
    { name: 'marks', key: 'mark' },
  ];

  const finishedArr = columnConfig.map(({ name, key }) => {
    const arr = tableData.map((row) => row[key]);
    return {
      name,
      arr,
      maxLength: Math.max(name.length, getMaximumLength(arr)),
    };
  });
  outputBuilder(finishedArr, await calculateGpa(page));
  return finishedArr;
};
