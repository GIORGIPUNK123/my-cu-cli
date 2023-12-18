import { Page } from 'puppeteer';
import { sbjString } from './basic_helper.js';
import { subjectOutput } from './subjectOutput.js';

export const subjectDetails = async (page: Page, sbj: string) => {
  console.log('sbj: ', sbj);
  // Find all <td> elements in the document
  await page.waitForNetworkIdle();
  // await page.waitForSelector('submit_masala');

  const elements = await page.$$('.submit_masala');
  const names = await Promise.all(
    elements.map(async (x, i) => {
      const selector = sbjString('name', ++i);
      return await page.evaluate(
        (sbjSelector: any, type) => {
          return type !== 'percentage'
            ? document.querySelector(sbjSelector)?.textContent || ''
            : document.querySelector(sbjSelector)?.value || '';
        },
        selector,
        'name'
      );
    })
  );
  const index = names.indexOf(sbj);
  elements[index * 2].click();
  await page.waitForNetworkIdle();
  const rows = await page.$$eval('td', (rows) => {
    return rows.map((row) => row.textContent);
  });
  let mainRows: any[][] = [];

  for (let i = 0; i < rows.length; i += 4) {
    mainRows.push(rows.slice(i, i + 4));
  }
  const bottomRows = mainRows.slice(mainRows.length - 3);
  mainRows.splice(-3);
  const maxLengthArr = new Array(mainRows[0].length).fill(0);

  [...mainRows, ['Exam Date', 'Exam', 'Max Score', 'Score']].forEach((row) => {
    row.forEach((value, index) => {
      maxLengthArr[index] = Math.max(
        maxLengthArr[index] || 0,
        value.toString().length
      );
    });
  });

  const better = [
    ['Interim Results - Total', bottomRows[0][1]],
    ['Maximum points of the exams entered', bottomRows[0][3]],
    ['Total points earned by the student', bottomRows[1][1]],
    [
      'Final per cent of the maximum points of the exams entered',
      bottomRows[1][3],
    ],
    [
      'Final grade from the maximum points of the exams entered',
      bottomRows[2][1],
    ],
  ];
  let bottomRowsMaxLengthArr = new Array(better[0].length).fill(0);
  better.forEach((row) => {
    row.forEach((value, index) => {
      if (bottomRowsMaxLengthArr[index] !== undefined) {
        bottomRowsMaxLengthArr[index] = Math.max(
          bottomRowsMaxLengthArr[index],
          value.toString().length
        );
      }
    });
  });
  subjectOutput(mainRows, maxLengthArr, better, bottomRowsMaxLengthArr).forEach(
    (x) => {
      console.log(x);
    }
  );
};
