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
      const out = await page.evaluate(
        (sbjSelector: any, type) => {
          return document.querySelector(sbjSelector)?.textContent;
        },
        selector,
        'name'
      );
      return out;
    })
  );
  const index = names.indexOf(sbj);
  elements[index * 2].click();
  await page.waitForNetworkIdle();
  const rows = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('td'));
    return rows.map((x) => x.textContent);
  });
  const reds = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('td'));
    return rows.map((x) => x.style.color);
  });

  const greens = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('td'));
    return rows.map((x) => x.style.backgroundColor);
  });
  let mainReds: any[][] = [];
  let mainRows: any[][] = [];
  let mainGreens: any[][] = [];

  for (let i = 0; i < rows.length; i += 4) {
    mainRows.push(rows.slice(i, i + 4));
    mainReds.push(reds.slice(i, i + 4));
    mainGreens.push(greens.slice(i, i + 4));
  }
  const bottomRows = mainRows.slice(mainRows.length - 3);
  const bufferReds = mainReds.slice(mainReds.length - 3);
  const bufferGreens = mainGreens.slice(mainGreens.length - 3);
  const bottomReds = [
    bufferReds[0][1],
    bufferReds[0][3],
    bufferReds[1][1],
    bufferReds[1][3],
    bufferReds[1][1],
  ].map((x) => (x === 'red' ? 1 : 0));
  const bottomGreens = [
    bufferGreens[0][1],
    bufferGreens[0][3],
    bufferGreens[1][1],
    bufferGreens[1][3],
    bufferGreens[1][1],
  ].map((x) => (x !== '' ? 0 : 1));
  mainRows.splice(-3);
  mainReds.splice(-3);
  mainGreens.splice(-3);
  const maxLengthArr = new Array(mainRows[0].length).fill(0);

  const topReds: number[] = mainReds.map((x) => (x.includes('red') ? 1 : 0));
  const topGreens: number[] = mainGreens.map((x) =>
    x.includes('rgb(189, 255, 206)') ? 1 : 0
  );

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
  subjectOutput(
    mainRows,
    maxLengthArr,
    better,
    bottomRowsMaxLengthArr,
    topReds,
    bottomReds,
    topGreens,
    bottomGreens
  ).forEach((x) => {
    console.log(x);
  });
};
