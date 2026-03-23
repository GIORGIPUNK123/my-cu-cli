import { Page } from 'puppeteer';
import { getMaximumLength, outputBuilder } from './basic_helper.ts';

type ScheduleItem = {
  code: string;
  name: string;
  lecturer: string;
  weekDay: string;
  time: string;
  room: string;
};

export const schedule = async (page: Page) => {
  await page.waitForNetworkIdle();
  await page.click('a[href="schedule.php"]');
  await page.waitForNetworkIdle();
  const scheduleData: ScheduleItem[] = await page.evaluate(() => {
    const scheduleTable = document.querySelector(
      'table[bordercolor="#CCCCCC"]',
    );
    return Array.from(scheduleTable!.querySelectorAll('tr'))
      .slice(1)
      .map((row) => {
        const cells = row.querySelectorAll('td');
        return {
          code: cells[0]?.textContent?.trim() || '',
          name: cells[1]?.textContent?.trim() || '',
          lecturer: cells[2]?.textContent?.trim() || '',
          weekDay: cells[3]?.textContent?.trim() || '',
          time: cells[4]?.textContent?.trim() || '',
          room: cells[5]?.textContent?.trim() || '',
        };
      });
  });

  const columnConfig: Array<{ name: string; key: keyof ScheduleItem }> = [
    { name: 'codes', key: 'code' },
    { name: 'names', key: 'name' },
    { name: 'lecturer', key: 'lecturer' },
    { name: 'weekDay', key: 'weekDay' },
    { name: 'time', key: 'time' },
    { name: 'room', key: 'room' },
  ];

  const finishedArr = columnConfig.map(({ name, key }) => {
    const arr = scheduleData.map((item) => item[key]);
    return {
      name,
      arr,
      maxLength: Math.max(name.length, getMaximumLength(arr)),
    };
  });

  outputBuilder(finishedArr);
  //   console.table(scheduleData);
};
