const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {

  res.sendStatus(200);
  const homePage = "https://jobs.halliburton.com/search/";

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

  const OtherHrefs = async () => {
    await page.goto(
      "https://jobs.halliburton.com/search/?q=&sortColumn=referencedate&sortDirection=desc&startrow=25"
    );

    return await page.evaluate(() => {
      return Array.from(document.getElementsByTagName("a"), (a) =>
        a.getAttribute("href")
      );
    });
  };

  const RestOfHrefs = async () => {
    await page.goto(
      "https://jobs.halliburton.com/search/?q=&sortColumn=referencedate&sortDirection=desc&startrow=50"
    );

    return await page.evaluate(() => {
      return Array.from(document.getElementsByTagName("a"), (a) =>
        a.getAttribute("href")
      );
    });
  };

  const urls = await hrefs();

  for (let i = 0; i < (await OtherHrefs().length); i++) {
    urls.push(OtherHrefs[i]);
  }

  for (let i = 0; i < (await RestOfHrefs().length); i++) {
    urls.push(OtherHrefs[i]);
  }

  const filteredUrls = urls.filter((link) => {
    if (link) {
      const jobsLink = "/job/";
      return link.substring(0, jobsLink.length) === jobsLink;
    }
  });

  for (let i = 0; i < filteredUrls.length; i++) {
    await page.goto(`https://jobs.halliburton.com/${filteredUrls[i]}`);
    const job = {};

    const header = await page.evaluate(() => {
      return Array.from(
        document.getElementsByTagName("h1"),
        (h1) => h1.innerText
      );
    });

    const datePosted = await page.evaluate(() => {
      return Array.from(
        document.getElementsByTagName("time"),
        (time) => time.innerText
      );
    });

    const jobLocation = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("jobGeoLocation"),
        (span) => span.textContent
      );
    });

    const jobDescription = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("jobdescription"),
        (job) => job.textContent
      );
    });

    const paragraphs = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("jobdescription"),
        (p) => {
          let arr = [];
          for (let i = 0; i < p.children.length; i++) {
            arr.push(p.children[i].innerText);
          }
          return arr;
        }
      );
    });

    job.company = "Halliburton";
    job.url = `https://jobs.halliburton.com/${filteredUrls[i]}`;
    job.jobTitle = header[0];
    job.datePosted = datePosted[0];
    job.workLocations = jobLocation[0];
    job.jobDescription = jobDescription[0];

    //Creating the new record in the database, for those records, which don't yet exist.
    db.OilAndGas.findOne({ url: job.url }).then((res) => {
      if (!res) {
        db.OilAndGas.create({
          company: job.company,
          datePosted: job.datePosted,
          jobDescription: job.jobDescription,
          jobType: job.jobType,
          url: job.url,
          workLocations: job.workLocations,
        }).catch((err) => console.log(err));
      }
    });

    //Removing jobs no longer posted on the website from our collection.
    db.OilAndGas.find()
      .then((records) => {
        for (let j = 0; j < records.length; j++) {
          if (urls.indexOf(records[j].url) === -1) {
            db.OilAndGas.updateOne(
              { url: records[j].url },
              { deleted: true }
            ).catch((err) => console.log("ERROR DELETING URL LINE 130", err));
          }
        }
      })
      .catch((err) =>
        console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 135", err)
      );
  }

};
