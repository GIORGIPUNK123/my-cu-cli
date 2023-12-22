import chalk from 'chalk';
import { Page } from 'puppeteer';

const stringFunc = (text: string, maxLength: number): string => {
  const spacesBefore = Math.max(0, Math.floor((maxLength - text.length) / 2));
  const spacesAfter = Math.max(0, maxLength - text.length - spacesBefore);
  const buffer = Array(spacesBefore).fill(' ');
  buffer.push(text);
  buffer.push(...Array(spacesAfter).fill(' '));
  return buffer.join('');
};

export const subjectOutput = (
  rowsArr: string[][],
  maxLengthArr: number[],
  bottomRows: string[][],
  bottomRowsMaxLengthArr: number[],
  topReds: number[],
  bottomReds: number[],
  topGreens: number[],
  bottomGreens: number[]
) => {
  let prettyArr: string[] = [];
  const headerArr = ['Exam Date', 'Exam', 'Max Score', 'Score'];
  const first_buffer = (maxLengthArr: number[]) => [
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
  const bottom_buffer = (maxLengthArr: number[]) => [
    '└',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┴'
        }`
    ),
    '┘',
  ];
  const infoPart = (
    maxLengthArr: number[],
    dataArr: string[][],
    reds: number[],
    greens: number[]
  ) =>
    dataArr.map((x, _) => {
      return [
        '│',
        ...maxLengthArr.map((x, i) => {
          if (dataArr[_].length === i + 1) {
            const value = stringFunc(dataArr[_][i], x);

            if (reds[_] === 1 && greens[_] === 1) {
              // Apply both red text and green background
              return chalk.bold.bgGreen.red(
                `${value}${i === maxLengthArr.length - 1 ? '' : '│'}`
              );
            } else if (reds[_] === 1) {
              // Apply red text
              return chalk.bold.red(
                `${value}${i === maxLengthArr.length - 1 ? '' : '│'}`
              );
            } else if (greens[_] === 1) {
              // Apply green background
              return chalk.bold.bgGreen.black(
                `${value}${i === maxLengthArr.length - 1 ? '' : '│'}`
              );
            } else {
              // No styling
              return `${value}${i === maxLengthArr.length - 1 ? '' : '│'}`;
            }
          } else {
            return `${stringFunc(dataArr[_][i], x)}${
              i === maxLengthArr.length - 1 ? '' : '│'
            }`;
          }
        }),
        '│',
      ];
    });
  const middlePart = (maxLengthArr: number[]) => [
    '├',
    ...maxLengthArr.map(
      (x, i) =>
        `${Array(x).fill('─').join('')}${
          i === maxLengthArr.length - 1 ? '' : '┼'
        }`
    ),
    '┤',
  ];
  prettyArr.push(first_buffer(maxLengthArr).join(''));
  prettyArr.push(prettierHeaderArr.join(''));
  prettyArr.push(middlePart(maxLengthArr).join(''));
  rowsArr.forEach((_, __) => {
    prettyArr.push(
      infoPart(maxLengthArr, rowsArr, topReds, topGreens)[__].join('')
    );
    __ !== rowsArr.length - 1
      ? prettyArr.push(middlePart(maxLengthArr).join(''))
      : null;
  });
  prettyArr.push(bottom_buffer(maxLengthArr).join(''));

  prettyArr.push(first_buffer(bottomRowsMaxLengthArr).join(''));

  bottomRows.forEach((_, __) => {
    prettyArr.push(
      infoPart(bottomRowsMaxLengthArr, bottomRows, bottomReds, bottomGreens)[
        __
      ].join('')
    );
    __ !== bottomRows.length - 1
      ? prettyArr.push(middlePart(bottomRowsMaxLengthArr).join(''))
      : prettyArr.push(bottom_buffer(bottomRowsMaxLengthArr).join(''));
  });

  return prettyArr;
};
