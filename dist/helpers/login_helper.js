var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const login = (page, name, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto('https://programs.cu.edu.ge/cu/loginStud');
    yield Promise.all([
        page.waitForSelector('button[name="submit"]'),
        page.waitForSelector('input[name="pirn"]'),
        page.waitForSelector('input[name="username"]'),
        page.waitForSelector('input[name="password"]'),
    ]);
    if (password) {
        const myName = name.split('');
        const myPassword = password.split('');
        yield page.type('input[name="username"]', myName);
        yield page.waitForNetworkIdle();
        yield page.type('input[name="password"]', myPassword);
        yield page.waitForNetworkIdle();
    }
    else {
        const myName = name.split('');
        yield page.type('input[name="pirn"]', myName.slice(0, -1));
        yield page.waitForNetworkIdle();
        yield page.type('input[name="pirn"]', myName.slice(-1));
        yield page.waitForNetworkIdle();
    }
    yield page.click('button[name=submit]');
});
