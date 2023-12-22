import chalk from 'chalk';
const stringFunc = (text, maxLength) => {
    const spacesBefore = Math.max(0, Math.floor((maxLength - text.length) / 2));
    const spacesAfter = Math.max(0, maxLength - text.length - spacesBefore);
    const buffer = Array(spacesBefore).fill(' ');
    buffer.push(text);
    buffer.push(...Array(spacesAfter).fill(' '));
    return buffer.join('');
};
export const subjectOutput = (rowsArr, maxLengthArr, bottomRows, bottomRowsMaxLengthArr, topReds, bottomReds) => {
    let prettyArr = [];
    const headerArr = ['Exam Date', 'Exam', 'Max Score', 'Score'];
    const first_buffer = (maxLengthArr) => [
        '┌',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┬'}`),
        '┐',
    ];
    const prettierHeaderArr = [
        '│',
        ...maxLengthArr.map((x, i) => `${stringFunc(headerArr[i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`),
        '│',
    ];
    const bottom_buffer = (maxLengthArr) => [
        '└',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┴'}`),
        '┘',
    ];
    const infoPart = (maxLengthArr, dataArr, reds) => dataArr.map((x, _) => {
        return [
            '│',
            ...maxLengthArr.map((x, i) => {
                if (dataArr[_].length === i + 1) {
                    if (reds[_] === 1) {
                        return `${chalk.red(stringFunc(dataArr[_][i], x))}${i === maxLengthArr.length - 1 ? '' : '│'}`;
                    }
                    else {
                        return `${stringFunc(dataArr[_][i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`;
                    }
                }
                else
                    return `${stringFunc(dataArr[_][i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`;
            }),
            '│',
        ];
    });
    const middlePart = (maxLengthArr) => [
        '├',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┼'}`),
        '┤',
    ];
    prettyArr.push(first_buffer(maxLengthArr).join(''));
    prettyArr.push(prettierHeaderArr.join(''));
    prettyArr.push(middlePart(maxLengthArr).join(''));
    rowsArr.forEach((_, __) => {
        prettyArr.push(infoPart(maxLengthArr, rowsArr, topReds)[__].join(''));
        __ !== rowsArr.length - 1
            ? prettyArr.push(middlePart(maxLengthArr).join(''))
            : null;
    });
    prettyArr.push(bottom_buffer(maxLengthArr).join(''));
    prettyArr.push(first_buffer(bottomRowsMaxLengthArr).join(''));
    bottomRows.forEach((_, __) => {
        prettyArr.push(infoPart(bottomRowsMaxLengthArr, bottomRows, bottomReds)[__].join(''));
        __ !== bottomRows.length - 1
            ? prettyArr.push(middlePart(bottomRowsMaxLengthArr).join(''))
            : prettyArr.push(bottom_buffer(bottomRowsMaxLengthArr).join(''));
    });
    return prettyArr;
};
