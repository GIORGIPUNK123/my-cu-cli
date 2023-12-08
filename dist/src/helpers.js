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
exports.get3Cols = exports.login = void 0;
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
    const rowSelector = type === 'name' ? rowNumber : rowNumber + 1;
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
// percentage = `body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(${2}) > td:nth-child(9) > input[type=text]`;
// 'body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(9) > input[type=text]';
const get3Cols = (page) => __awaiter(void 0, void 0, void 0, function* () {
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
    return [
        { name: 'names', arr: namesContentArr },
        { name: 'credits', arr: creditsContentArr },
        { name: 'percentages', arr: percentagesContentArr },
        { name: 'marks', arr: marksContentArr },
    ];
});
exports.get3Cols = get3Cols;
// export const getPercentages = async (page: Page) => {
//   // document.querySelector(
//   // );
//   // document.querySelector(
//   `body > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(${2}) > td:nth-child(9) > input[type=text]`;
//   // );
//   };
// };
