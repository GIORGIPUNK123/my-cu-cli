var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getWholeTable } from "./basic_helper.js";
import { subjectOutput } from "./subjectOutput.js";
export const subjectDetails = (page, subjectKey) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.waitForNetworkIdle();
    let subjectCode = subjectKey;
    let subjectRowIndex = null;
    if (subjectKey.startsWith('subject::')) {
        const parts = subjectKey.split('::');
        if (parts.length === 3) {
            const parsedIndex = Number.parseInt(parts[1], 10);
            subjectRowIndex = Number.isNaN(parsedIndex) ? null : parsedIndex;
            subjectCode = parts[2];
        }
    }
    const subjects = yield getWholeTable(page);
    const hasSubject = subjects.some((row) => row.code.trim() === subjectCode.trim());
    if (!hasSubject) {
        throw new Error(`Subject code not found: ${subjectCode}`);
    }
    const popupPromise = page
        .browser()
        .waitForTarget((target) => target.opener() === page.target(), {
        timeout: 3000,
    })
        .then((target) => target.page())
        .catch(() => null);
    const clicked = yield page.$$eval('table tbody tr table tbody tr', (rows, args) => {
        const normalizeCode = (value) => value.replace(/\s+/g, '').toUpperCase();
        const courseRows = rows.slice(1).filter((row) => {
            const hasYearInput = row.querySelector('td:nth-child(1) input');
            const hasCodeSubmit = row.querySelector('td:nth-child(2) input[type="submit"]');
            return Boolean(hasYearInput && hasCodeSubmit);
        });
        let targetRow;
        if (typeof args.index === 'number' && args.index >= 0) {
            const indexedRow = courseRows[args.index];
            if (indexedRow) {
                const codeInput = indexedRow.querySelector('td:nth-child(2) input[type="submit"]');
                if (codeInput &&
                    normalizeCode(codeInput.value) === normalizeCode(args.code)) {
                    targetRow = indexedRow;
                }
            }
        }
        else {
            targetRow = courseRows.find((row) => {
                const codeInput = row.querySelector('td:nth-child(2) input[type="submit"]');
                if (!codeInput) {
                    return false;
                }
                return normalizeCode(codeInput.value) === normalizeCode(args.code);
            });
        }
        // Fallback to exact code match if index pointed to an unexpected row.
        if (!targetRow) {
            targetRow = courseRows.find((row) => {
                const codeInput = row.querySelector('td:nth-child(2) input[type="submit"]');
                if (!codeInput) {
                    return false;
                }
                return normalizeCode(codeInput.value) === normalizeCode(args.code);
            });
        }
        if (!targetRow) {
            return false;
        }
        const target = targetRow.querySelector('td:nth-child(2) input[type="submit"]');
        if (!target) {
            return false;
        }
        target.click();
        return true;
    }, { code: subjectCode, index: subjectRowIndex });
    if (!clicked) {
        throw new Error(`Failed to click subject button for code: ${subjectCode}`);
    }
    const newPage = yield popupPromise;
    const targetPage = newPage !== null && newPage !== void 0 ? newPage : page;
    try {
        yield targetPage.waitForNetworkIdle();
        const rows = yield targetPage.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('td'));
            return rows.map((x) => x.textContent);
        });
        const reds = yield targetPage.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('td'));
            return rows.map((x) => x.style.color);
        });
        const greens = yield targetPage.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('td'));
            return rows.map((x) => x.style.backgroundColor);
        });
        let mainReds = [];
        let mainRows = [];
        let mainGreens = [];
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
        const topReds = mainReds.map((x) => (x.includes('red') ? 1 : 0));
        const topGreens = mainGreens.map((x) => x.includes('rgb(189, 255, 206)') ? 1 : 0);
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
        subjectOutput(mainRows, maxLengthArr, better, bottomRowsMaxLengthArr, topReds, bottomReds, topGreens, bottomGreens).forEach((x) => {
            console.log(x);
        });
    }
    finally {
        if (newPage && !newPage.isClosed()) {
            yield newPage.close();
        }
    }
});
