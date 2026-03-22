var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const calculateGpa = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.waitForSelector('form[name="form1"] input');
    yield page.click('form[name="form1"] input');
    yield page.waitForNetworkIdle();
    const result = yield page.$$eval('table tbody tr table tbody tr', (rows) => {
        let newArr = [];
        rows.slice(1).forEach((row) => {
            var _a;
            const columns = row.querySelectorAll('td');
            const tdLength = columns.length;
            if (tdLength === 3) {
                const name = ((_a = columns[0].textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                const firstGpa = columns[1].querySelector('input[name="wpr"]');
                const secondGpa = columns[2].querySelector('input[name="wgpa"]');
                newArr.push({
                    name: name,
                    first: (firstGpa === null || firstGpa === void 0 ? void 0 : firstGpa.value) || '',
                    second: (secondGpa === null || secondGpa === void 0 ? void 0 : secondGpa.value) || '',
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
});
const outputBuilder = (data, gpa) => {
    let headerArr = [];
    let rowsArr = [];
    let maxLengthArr = [];
    const stringFunc = (text, maxLength) => {
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
        const spacesBefore = Math.max(0, Math.floor((x.maxLength - colName.length) / 2));
        headerArr.push(stringFunc(colName, maxLengthArr[i]));
        rowsArr.push(x.arr);
    });
    // Transpose the matrix
    const transposedMatrix = rowsArr[0].map((_, colIndex) => rowsArr.map((row, i) => stringFunc(row[colIndex], maxLengthArr[i])));
    let prettyArr = [];
    const first_buffer = [
        '┌',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┬'}`),
        '┐',
    ];
    const prettierHeaderArr = [
        '│',
        ...maxLengthArr.map((x, i) => `${stringFunc(headerArr[i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`),
        '│',
    ];
    const bottom_buffer = [
        '└',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┴'}`),
        '┘',
    ];
    const middlePart = [
        '├',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┼'}`),
        '┤',
    ];
    const blocks = [];
    let currentBlock = [];
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
                ...maxLengthArr.map((x, i) => `${stringFunc(row[i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`),
                '│',
            ];
            prettyArr.push(rowPart.join(''));
            if (rowIndex !== blockRows.length - 1) {
                prettyArr.push(middlePart.join(''));
            }
            else {
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
    if (gpa.length > 0) {
        console.log('\n'); // Add spacing
        const gpaHeaderArr = ['Name', 'First', 'Second'];
        const gpaRowsArr = gpa.map((item) => [item.name, item.first, item.second]);
        const gpaMaxLengths = [
            Math.max(gpaHeaderArr[0].length, ...gpaRowsArr.map((row) => row[0].length)),
            Math.max(gpaHeaderArr[1].length, ...gpaRowsArr.map((row) => row[1].length)),
            Math.max(gpaHeaderArr[2].length, ...gpaRowsArr.map((row) => row[2].length)),
        ];
        const stringFunc = (text, maxLength) => {
            const spacesBefore = Math.max(0, Math.floor((maxLength - text.length) / 2));
            const spacesAfter = Math.max(0, maxLength - text.length - spacesBefore);
            const buffer = Array(spacesBefore).fill(' ');
            buffer.push(text);
            buffer.push(...Array(spacesAfter).fill(' '));
            return buffer.join('');
        };
        // GPA table borders
        const gpaFirstBuffer = [
            '┌',
            ...gpaMaxLengths.map((x, i) => `${Array(x).fill('─').join('')}${i === gpaMaxLengths.length - 1 ? '' : '┬'}`),
            '┐',
        ].join('');
        const gpaHeaderRow = [
            '│',
            ...gpaMaxLengths.map((x, i) => `${stringFunc(gpaHeaderArr[i], x)}${i === gpaMaxLengths.length - 1 ? '' : '│'}`),
            '│',
        ].join('');
        const gpaMiddleBuffer = [
            '├',
            ...gpaMaxLengths.map((x, i) => `${Array(x).fill('─').join('')}${i === gpaMaxLengths.length - 1 ? '' : '┼'}`),
            '┤',
        ].join('');
        const gpaBottomBuffer = [
            '└',
            ...gpaMaxLengths.map((x, i) => `${Array(x).fill('─').join('')}${i === gpaMaxLengths.length - 1 ? '' : '┴'}`),
            '┘',
        ].join('');
        const gpaBlocks = [];
        let currentBlock = [];
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
                    ...gpaMaxLengths.map((x, i) => `${stringFunc(row[i], x)}${i === gpaMaxLengths.length - 1 ? '' : '│'}`),
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
export const sbjString = (type, rowNumber) => {
    const baseSelector = 'body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody';
    const rowSelector = type === 'name' ? rowNumber + 1 : rowNumber + 1;
    const columnSelector = type === 'name'
        ? 3
        : type === 'credit'
            ? 4
            : type === 'percentage'
                ? 9
                : 10;
    const inputSelector = type === 'percentage' ? ' > input[type=text]' : '';
    return `${baseSelector} > tr:nth-child(${rowSelector}) > td:nth-child(${columnSelector})${inputSelector}`;
};
export const getColumnContent = (type, index, page) => __awaiter(void 0, void 0, void 0, function* () {
    const selector = sbjString(type, index);
    const element = yield page.evaluate((sbjSelector, type) => {
        var _a, _b;
        return type !== 'percentage'
            ? ((_a = document.querySelector(sbjSelector)) === null || _a === void 0 ? void 0 : _a.textContent) || ''
            : ((_b = document.querySelector(sbjSelector)) === null || _b === void 0 ? void 0 : _b.value) || '';
    }, selector, type);
    return element;
});
export const getWholeTable = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield page.$$eval('table tbody tr table tbody tr', (rows) => {
        let newArr = [];
        rows.slice(1).forEach((row) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const columns = row.querySelectorAll('td');
            const hasInput = columns[0].querySelector('input');
            if (hasInput) {
                newArr.push({
                    year: ((_a = columns[0].querySelector('input')) === null || _a === void 0 ? void 0 : _a.value) || '',
                    code: ((_c = (_b = columns[1]) === null || _b === void 0 ? void 0 : _b.querySelector('input[type="submit"]')) === null || _c === void 0 ? void 0 : _c.value) || 'NOT FOUND',
                    name: ((_e = (_d = columns[2]) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || '',
                    credit: ((_g = (_f = columns[3]) === null || _f === void 0 ? void 0 : _f.textContent) === null || _g === void 0 ? void 0 : _g.trim()) || '',
                    percentage: ((_h = columns[4].querySelector('input')) === null || _h === void 0 ? void 0 : _h.value) || '',
                    mark: ((_k = (_j = columns[5]) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || '',
                });
            }
        });
        return newArr;
    });
    return result;
});
export const getAvailableSubjects = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const table = yield getWholeTable(page);
    return table.map((row) => row.name);
});
export const availableSubjects = getAvailableSubjects;
export const getBasic = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const tableData = yield getWholeTable(page);
    let yearsContentArr = [];
    let codesContentArr = [];
    let namesContentArr = [];
    let creditsContentArr = [];
    let percentagesContentArr = [];
    let marksContentArr = [];
    tableData.forEach((row) => {
        yearsContentArr.push(row.year);
        codesContentArr.push(row.code);
        namesContentArr.push(row.name);
        creditsContentArr.push(row.credit);
        percentagesContentArr.push(row.percentage);
        marksContentArr.push(row.mark);
    });
    const checkArrayContent = (arr) => {
        return arr.reduce((maxLength, item) => {
            return Math.max(maxLength, item.length);
        }, 0);
    };
    const yearsLongest = checkArrayContent(yearsContentArr);
    const codesLongest = checkArrayContent(codesContentArr);
    const namesLongest = checkArrayContent(namesContentArr);
    const creditsLongest = checkArrayContent(creditsContentArr);
    const percentagesLongest = checkArrayContent(percentagesContentArr);
    const marksLongest = checkArrayContent(marksContentArr);
    const finishedArr = [
        {
            name: 'years',
            arr: yearsContentArr,
            maxLength: 'years'.length < yearsLongest ? yearsLongest : 'years'.length,
        },
        {
            name: 'codes',
            arr: codesContentArr,
            maxLength: 'codes'.length < codesLongest ? codesLongest : 'codes'.length,
        },
        {
            name: 'names',
            arr: namesContentArr,
            maxLength: 'names'.length < namesLongest ? namesLongest : 'names'.length,
        },
        {
            name: 'credits',
            arr: creditsContentArr,
            maxLength: 'names'.length < creditsLongest ? creditsLongest : 'credits'.length,
        },
        {
            name: 'percentages',
            arr: percentagesContentArr,
            maxLength: 'percentages'.length < percentagesLongest
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
    outputBuilder(finishedArr, yield calculateGpa(page));
    // console.log(Array(longestLength).fill('-').join(''));
    return finishedArr;
});
