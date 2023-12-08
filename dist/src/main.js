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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainFunc = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const helpers_1 = require("./helpers");
const mainFunc = (pirn) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: 'new' });
    const page = yield browser.newPage();
    try {
        yield page.setViewport({ width: 1080, height: 1024 });
        yield (0, helpers_1.login)(page, pirn);
        yield page.waitForNetworkIdle();
        yield page.goto('https://programs.cu.edu.ge/students/gpa.php');
        return yield (0, helpers_1.get3Cols)(page);
    }
    catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
    finally {
        browser.close();
    }
});
exports.mainFunc = mainFunc;
