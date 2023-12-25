const puppeteer = require("puppeteer");
//process single page
exports.processProductPage = async function (page, url, context) {
  try {
    await page.goto(url);
    const InfoObject = await page.evaluate((url) => {
      const title = document.querySelector(
        "._1AtVbE h1 span:last-child"
      )?.textContent;
      let price = document.querySelector(`._30jeq3._16Jk6d`)?.textContent;

      price = Number(price?.slice(1, price?.length).replace(",", ""));
      const avaliable =
        document.querySelector(`button._2Dfasx`)?.textContent?.toLowerCase() ===
        "notify me"
          ? 0
          : 1;

      const rating = Number(document.querySelector("._3LWZlK")?.textContent);
      const img = document.querySelector(`._2r_T1I`)?.src;
      const noRatings = Number(
        document
          .querySelector("._2_R_DZ")
          ?.textContent?.split(" ")?.[0]
          .replace(",", "")
      );

      const noReviews = Number(
        document
          .querySelector("._2_R_DZ")
          ?.textContent?.split(" ")?.[3]
          .replace(",", "")
      );
      return {
        title,
        price,
        rating,
        noRatings,
        noReviews,
        url,
        img,
        avaliable,
      };
    }, url);
    return InfoObject;
  } catch (err) {
    context.log(err);
  }
};

// process a search page with all products on it
exports.processSearchPage = async function (page, context) {
  try {
    const urls = await page.evaluate(() => {
      const linkTags = document.querySelectorAll("._1AtVbE ._13oc-S a[title]");
      const urls = [];
      for (const linkTag of linkTags) {
        urls.push(linkTag?.href);
      }
      return urls;
    });
    const productData = [];
    for (const url of urls) {
      try {
        const InfoObject = await exports.processProductPage(page, url, context);
        context.log(InfoObject);
        productData.push(InfoObject);
      } catch (err) {
        context.log(err);
      }
    }
    return productData;
  } catch (err) {
    context.log(err);
  }
};
//main function
exports.main = async function (term, context) {
  // Launch the browser and open a new blank page
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp",
    });
    const page = await browser.newPage();
    await page.goto("https://www.flipkart.com/");
    await page.type(".Pke_EE", term);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    const data = [];
    while (true) {
      try {
        const processedInfo = await exports.processSearchPage(page, context);
        data.concat(processedInfo);
        const nextUrl = await page.evaluate(() => {
          const Elements = document.querySelectorAll("._1LKTO3");
          for (const Element of Elements) {
            if (Element.textContent.toLowerCase() === "next") {
              return Element.href;
            }
          }
          return undefined;
        });
        if (nextUrl) {
          await page.goto(nextUrl);
        } else {
          break;
        }
      } catch (err) {
        context.log(err);
      }
    }
  } catch (err) {
    context.log(err);
  }
};
