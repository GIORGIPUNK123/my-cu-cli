"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get4Cols = exports.login = void 0;
const outputBuilder = (data) => {
    let headerArr = [];
    let rowsArr = [];
    let resultArr = [];
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
        const spacesAfter = Math.max(0, x.maxLength - colName.length - spacesBefore);
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
    const infoPart = transposedMatrix.map((x, _) => {
        return [
            '│',
            ...maxLengthArr.map((x, i) => `${stringFunc(transposedMatrix[_][i], x)}${i === maxLengthArr.length - 1 ? '' : '│'}`),
            '│',
        ];
    });
    const middlePart = [
        '├',
        ...maxLengthArr.map((x, i) => `${Array(x).fill('─').join('')}${i === maxLengthArr.length - 1 ? '' : '┼'}`),
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
const login = (page, pirn) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto('https://programs.cu.edu.ge/cu/loginStud');
    yield Promise.all([
        page.waitForSelector('button[name="submit"]'),
        page.waitForSelector('input[name="pirn"]'),
        page.waitForSelector('input[name="username"]'),
        page.waitForSelector('input[name="password"]'),
    ]);
    const myPirn = pirn.split('');
    yield page.type('input[name="pirn"]', myPirn.slice(0, -1));
    yield page.waitForNetworkIdle();
    yield page.type('input[name="pirn"]', myPirn.slice(-1));
    yield page.type('input[name="password"]', myPirn);
    yield page.waitForNetworkIdle();
    yield page.click('button[name=submit]');
});
exports.login = login;
const sbjString = (type, rowNumber) => {
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
const get4Cols = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const getColumnContent = (type, index) => __awaiter(void 0, void 0, void 0, function* () {
        const selector = sbjString(type, index);
        const element = yield page.evaluate((sbjSelector, type) => {
            var _a, _b;
            return type !== 'percentage'
                ? ((_a = document.querySelector(sbjSelector)) === null || _a === void 0 ? void 0 : _a.textContent) || ''
                : ((_b = document.querySelector(sbjSelector)) === null || _b === void 0 ? void 0 : _b.value) || '';
        }, selector, type);
        return element;
    });
    let namesContentArr = [];
    let creditsContentArr = [];
    let percentagesContentArr = [];
    let marksContentArr = [];
    for (let i = 1; i <= 6; i++) {
        const nameContent = yield getColumnContent('name', i);
        const creditContent = yield getColumnContent('credit', i);
        const percentageContent = yield getColumnContent('percentage', i);
        const markContent = yield getColumnContent('mark', i);
        namesContentArr.push(nameContent);
        creditsContentArr.push(creditContent);
        percentagesContentArr.push(percentageContent);
        marksContentArr.push(markContent);
    }
    const checkArrayContent = (arr) => {
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
    outputBuilder(finishedArr);
    // console.log(Array(longestLength).fill('-').join(''));
    return finishedArr;
});
exports.get4Cols = get4Cols;
