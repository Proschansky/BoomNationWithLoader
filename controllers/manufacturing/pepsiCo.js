const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const homePage = "https://www.pepsicojobs.com/main/jobs?categories=Manufacturing%20and%20Production%20&page=1&limit=100";

  const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
  });

  const page = await browser.newPage();

  const hrefs = async () => {
    await page.goto(homePage);

    return await page.evaluate(() => {
      return Array.from(document.getElementsByTagName("a"), (a)=>a.getAttribute("href"));
    });
  };

  const urls = await hrefs();

  const filteredUrls = urls.filter((link) => {
    if (link) {
      const jobsLink = "/main/jobs/";
      return link.substring(0, jobsLink.length) === jobsLink;
    }
  });

  for (let i = 0; i < filteredUrls.length; i++) {
    await page.goto(`https://www.pepsicojobs.com${filteredUrls[i]}`);
    const job = {};

    const header = await page.evaluate(() => {
      return Array.from(
        document.getElementsByTagName("h1"),
        (h1) => h1.innerText
      );
    });

    const listItems = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("meta-data-option"),
        (data) => data.textContent
      );
    });

    const paragraphs = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("main-description-body"),
        (desc) => desc.textContent
      );
    });

    job.url = `https://www.pepsicojobs.com${filteredUrls[i]}`;
    job.jobTitle = header[0];
    job.workLocations = listItems[0];
    job.jobType = listItems[1];
    job.internalId = listItems[2];
    job.jobDescription = paragraphs[0];
    job.company = "PepsiCo";

    //Creating the new record in the database, for those records, which don't yet exist.
    db.Manufacturing.findOne({ url: job.url }).then((res) => {
      if (!res) {
        db.Manufacturing.create({
          company: job.company,
          jobDescription: job.jobDescription,
          internalId: job.internalId,
          jobTitle: job.jobTitle,
          jobType: job.jobType,
          url: job.url,
          workLocations: job.workLocations,
        }).catch((err) => console.log(err));
      }
    });

    //Removing jobs no longer posted on the website from our collection.
    db.Manufacturing.find()
      .then((records) => {
        for (let j = 0; j < records.length; j++) {
          if (urls.indexOf(records[j].url) === -1) {
            db.Manufacturing.updateOne(
              { url: records[j].url },
              { deleted: true }
            ).catch((err) => console.log("ERROR DELETING URL LINE 88", err));
          }
        }
      })
      .catch((err) =>
        console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 93", err)
      );
  }

};
