const { readSearchTerms } = require("../../utils/fileProcessing");
const { main } = require("../../utils/pageProcessing");
const puppeteer = require("puppeteer");
const path = require("path");
exports.handler = async () => {
  // (async () => {
  //   const searchTerms = readSearchTerms();
  //   console.log(searchTerms);
  //   for (const searchTerm of searchTerms) {
  //     await main(searchTerm);
  //   }
  // })();
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(
    "https://en.wikipedia.org/wiki/Cron#:~:text=Asterisks%20(also%20known%20as%20wildcard,second%20when%20seconds%20are%20supported."
  );
  const title = await page.evaluate(() => {
    return document.querySelector(`#firstHeading`).textContent;
  });
  return {
    statusCode: 200,
    body: title,
  };
};
