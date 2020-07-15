const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  console.log('api/trucking/pilotFlying hit')
  const homePage = "https://jobs.pilotflyingj.com/drivers?page_size=250&page_number=1&sort_by=headline&sort_order=ASC&custom_categories=Driver%20Position&custom_categories=All%20Driver%20Positions&custom_categories=DEF%20Driver%20Position&custom_categories=PFJ%20Crude%20Driver&custom_categories=Driver%20Positions&custom_categories=All%20Driver%20Jobs";

  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const hrefs = async () => {
    await page.goto(homePage);

    return await page.evaluate(() => {
      return Array.from(document.getElementsByTagName("a"), (a) =>
        a.getAttribute("href")
      );
    });
  };

  const urls = await hrefs();

  const filteredUrls = urls.filter((link) => {
    const leaseOperator = "/lease-operator-driver-job";
    const classA = "/class-a";
    const truckCare = "/truck-care";
    return link.substring(0, leaseOperator.length) !== leaseOperator || 
    link.substring(0, classA.length) !== classA ||
    link.substring(0, truckCare.length) === truckCare
  });

  console.log(filteredUrls)
 
  res.json(filteredUrls);
};
