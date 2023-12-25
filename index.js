import puppeteer from "puppeteer";
//process single page
const processProductPage = async function (page, url) {
  try {
    await page.goto(url);
    const InfoObject = await page.evaluate((url) => {
      const title = document.querySelector(
        "._1AtVbE h1 span:last-child"
      )?.textContent;
      let price = document.querySelector(`._30jeq3._16Jk6d`)?.textContent;

      price = Number(price?.slice(1, price?.length));
      const avaliable =
        document.querySelector(`button._2Dfasx`)?.textContent?.toLowerCase() ===
        "notify me"
          ? 0
          : 1;

      const rating = Number(document.querySelector("._3LWZlK")?.textContent);
      const img = document.querySelector(`._2r_T1I`).src;
      const noRatings = document.querySelector("._2_R_DZ")?.textContent;

      return {
        title,
        price,
        rating,
        noRatings,
        url,
        img,
        avaliable,
      };
    }, url);
    return InfoObject;
  } catch (err) {
    console.log(err);
  }
};

// process a search page with all products on it

const processSearchPage = async function (page) {
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
        const InfoObject = await processProductPage(page, url);
        console.log(InfoObject);
        productData.push(InfoObject);
      } catch (err) {
        console.log(err);
      }
    }
    return productData;
  } catch (err) {
    console.log(err);
  }
};

//main function
(async () => {
  // Launch the browser and open a new blank page
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp",
    });
    const page = await browser.newPage();
    await page.goto("https://www.flipkart.com/");
    await page.type(".Pke_EE", "shoes");
    await page.keyboard.press("Enter");
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
    const data = [];
    while (true) {
      try {
        const processedInfo = await processSearchPage(page);
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
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
