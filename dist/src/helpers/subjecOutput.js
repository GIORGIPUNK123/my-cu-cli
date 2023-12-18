// import { Page } from 'puppeteer';
export {};
// const output = (data: { name: string; arr: string[]; maxLength: number }[]) => {
//   let headerArr: string[] = [];
//   let rowsArr: string[][] = [];
//   let maxLengthArr: number[] = [];
//   data.forEach((x) => {
//     maxLengthArr.push(x.maxLength);
//   });
//   data.forEach((x, i) => {
//     const colName = x.name;
//     const spacesBefore = Math.max(
//       0,
//       Math.floor((x.maxLength - colName.length) / 2)
//     );
//     headerArr.push(stringFunc(colName, maxLengthArr[i]));
//     rowsArr.push(x.arr);
//   });
//   // Transpose the matrix
//   const transposedMatrix = rowsArr[0].map((_, colIndex) =>
//     rowsArr.map((row, i) => stringFunc(row[colIndex], maxLengthArr[i]))
//   );
//   let prettyArr: string[] = [];
//   const first_buffer = [
//     '┌',
//     ...maxLengthArr.map(
//       (x, i) =>
//         `${Array(x).fill('─').join('')}${
//           i === maxLengthArr.length - 1 ? '' : '┬'
//         }`
//     ),
//     '┐',
//   ];
//   const prettierHeaderArr = [
//     '│',
//     ...maxLengthArr.map(
//       (x, i) =>
//         `${stringFunc(headerArr[i], x)}${
//           i === maxLengthArr.length - 1 ? '' : '│'
//         }`
//     ),
//     '│',
//   ];
//   const bottom_buffer = [
//     '└',
//     ...maxLengthArr.map(
//       (x, i) =>
//         `${Array(x).fill('─').join('')}${
//           i === maxLengthArr.length - 1 ? '' : '┴'
//         }`
//     ),
//     '┘',
//   ];
//   const infoPart = transposedMatrix.map((x, _) => {
//     return [
//       '│',
//       ...maxLengthArr.map(
//         (x, i) =>
//           `${stringFunc(transposedMatrix[_][i], x)}${
//             i === maxLengthArr.length - 1 ? '' : '│'
//           }`
//       ),
//       '│',
//     ];
//   });
//   const middlePart = [
//     '├',
//     ...maxLengthArr.map(
//       (x, i) =>
//         `${Array(x).fill('─').join('')}${
//           i === maxLengthArr.length - 1 ? '' : '┼'
//         }`
//     ),
//     '┤',
//   ];
//   prettyArr.push(first_buffer.join(''));
//   prettyArr.push(prettierHeaderArr.join(''));
//   prettyArr.push(middlePart.join(''));
//   transposedMatrix.forEach((_, __) => {
//     prettyArr.push(infoPart[__].join(''));
//     __ !== transposedMatrix.length - 1
//       ? prettyArr.push(middlePart.join(''))
//       : prettyArr.push(bottom_buffer.join(''));
//   });
//   prettyArr.forEach((x) => {
//     console.log(x);
//   });
// };
