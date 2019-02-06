const { Cluster } = require('puppeteer-cluster');
(async () => {})();

// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 250, // slow down by 250ms
//   });

//   const context = await browser.createIncognitoBrowserContext();
//   const page = await context.newPage();
//   await page.goto(
//     'http://cyber.inhatc.ac.kr/Main.do?cmd=viewHome&userDTO.localeKey=ko'
//   );
//   await page.waitFor(3000);
//   await page.evaluate(
//     (a, b) => {
//       document.querySelector('#id').value = a;
//       document.querySelector('#pw').value = b;
//       document.querySelector('.loginBtn').click();
//     },
//     '0',
//     'Metal0102'
//   );

//   page.on('dialog', async dialog => {
//     console.log(dialog.message());
//     await dialog.dismiss();
//   });
// })();
