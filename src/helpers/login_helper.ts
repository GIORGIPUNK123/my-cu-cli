export const login = async (page: any, pirn: string) => {
  await page.goto('https://programs.cu.edu.ge/cu/loginStud');
  await Promise.all([
    page.waitForSelector('button[name="submit"]'),
    page.waitForSelector('input[name="pirn"]'),
    page.waitForSelector('input[name="username"]'),
    page.waitForSelector('input[name="password"]'),
  ]);
  const myPirn = pirn.split('');
  await page.type('input[name="pirn"]', myPirn.slice(0, -1));
  await page.waitForNetworkIdle();
  await page.type('input[name="pirn"]', myPirn.slice(-1));
  await page.type('input[name="password"]', myPirn);
  await page.waitForNetworkIdle();
  await page.click('button[name=submit]');
};
