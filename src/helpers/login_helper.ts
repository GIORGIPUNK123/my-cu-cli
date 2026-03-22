export const login = async (page: any, name: string, password?: string) => {
  await page.goto('https://programs.cu.edu.ge/cu/loginStud');
  await Promise.all([
    page.waitForSelector('button[name="submit"]'),
    page.waitForSelector('input[name="pirn"]'),
    page.waitForSelector('input[name="username"]'),
    page.waitForSelector('input[name="password"]'),
  ]);
  if (password) {
    const myName = name.split('');
    const myPassword = password.split('');
    await page.type('input[name="username"]', myName);
    await page.waitForNetworkIdle();
    await page.type('input[name="password"]', myPassword);
    await page.waitForNetworkIdle();
  } else {
    const myName = name.split('');
    await page.type('input[name="pirn"]', myName.slice(0, -1));
    await page.waitForNetworkIdle();
    await page.type('input[name="pirn"]', myName.slice(-1));
    await page.waitForNetworkIdle();
  }
  await page.click('button[name=submit]');
};
