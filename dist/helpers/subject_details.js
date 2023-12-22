var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sbjString } from './basic_helper.js';
import { subjectOutput } from './subjectOutput.js';
export const subjectDetails = (page, sbj) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('sbj: ', sbj);
    // Find all <td> elements in the document
    yield page.waitForNetworkIdle();
    // await page.waitForSelector('submit_masala');
    const elements = yield page.$$('.submit_masala');
    const names = yield Promise.all(elements.map((x, i) => __awaiter(void 0, void 0, void 0, function* () {
        const selector = sbjString('name', ++i);
        const out = yield page.evaluate((sbjSelector, type) => {
            var _a;
            return (_a = document.querySelector(sbjSelector)) === null || _a === void 0 ? void 0 : _a.textContent;
        }, selector, 'name');
        return out;
    })));
    const index = names.indexOf(sbj);
    elements[index * 2].click();
    yield page.waitForNetworkIdle();
    const rows = yield page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('td'));
        return rows.map((x) => x.textContent);
    });
    const reds = yield page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('td'));
        return rows.map((x) => x.style.color);
    });
    let mainReds = [];
    let mainRows = [];
    for (let i = 0; i < rows.length; i += 4) {
        mainRows.push(rows.slice(i, i + 4));
        mainReds.push(reds.slice(i, i + 4));
    }
    const bottomRows = mainRows.slice(mainRows.length - 3);
    const buffer = mainReds.slice(mainReds.length - 3);
    const bottomReds = [
        buffer[0][1],
        buffer[0][3],
        buffer[1][1],
        buffer[1][3],
        buffer[1][1],
    ].map((x) => (x === 'red' ? 1 : 0));
    mainRows.splice(-3);
    mainReds.splice(-3);
    const maxLengthArr = new Array(mainRows[0].length).fill(0);
    const topReds = mainReds.map((x) => (x.includes('red') ? 1 : 0));
    console.log('bottomRows: ', bottomRows);
    [...mainRows, ['Exam Date', 'Exam', 'Max Score', 'Score']].forEach((row) => {
        row.forEach((value, index) => {
            maxLengthArr[index] = Math.max(maxLengthArr[index] || 0, value.toString().length);
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
                bottomRowsMaxLengthArr[index] = Math.max(bottomRowsMaxLengthArr[index], value.toString().length);
            }
        });
    });
    subjectOutput(mainRows, maxLengthArr, better, bottomRowsMaxLengthArr, topReds, bottomReds).forEach((x) => {
        console.log(x);
    });
});
