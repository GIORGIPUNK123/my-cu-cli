var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getBasic } from './helpers/basic_helper.js';
import { subjectDetails } from './helpers/subject_details.js';
export const mainFunc = (page, browser, pirn, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield page.setViewport({ width: 1080, height: 1024 });
        type === 'basic' ? yield getBasic(page) : yield subjectDetails(page, type);
    }
    catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
    finally {
        yield browser.close();
    }
});
