const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const homePage = "https://driveknight.com/jobs/?";

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
    const jobsLink = "https://driveknight.com/job/";
    return link !== null && link.substring(0, jobsLink.length) === jobsLink;
  });

  for (let i = 0; i < filteredUrls.length; i++) {
    await page.goto(filteredUrls[i]);
    const job = {};

    const tableDisplays = await page.evaluate(() => {
      return Array.from(
        document.getElementsByTagName("td"),
        (td) => td.innerText
      );
    });

    const requirements = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("requirements"),
        (ul) => {
          let arr = [];
          for (let i = 0; i < ul.children.length; i++) {
            arr.push(ul.children[i].innerText);
          }
          return arr;
        }
      );
    });

    const paragraphs = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName("p"), (p) => p.innerText);
    });

    job.company = "Knight Swift";
    job.workLocations = tableDisplays[1];
    job.jobClassification = `${tableDisplays[3]} ${tableDisplays[5]} ${tableDisplays[7]}`;
    job.url = filteredUrls[i];
    job.benefits = requirements[0];
    job.skillsAndExperience = [requirements[1][0], requirements[2][0]];
    job.jobDescription = paragraphs[4];

    //Creating the new record in the database, for those records, which don't yet exist.
    db.Trucking.findOne({ url: job.url }).then((res) => {
      if (!res) {
        db.Trucking.create({
          company: job.company,
          jobClassification: job.jobClassification,
          jobDescription: job.jobDescription,
          jobType: job.jobType,
          skillsAndExperience: job.skillsAndExperience,
          url: job.url,
          workLocations: job.workLocations,
        }).catch((err) => console.log(err, job.url));
      }
    });

    //Removing jobs no longer posted on the website from our collection.
    db.Trucking.find()
      .then((records) => {
        for (let j = 0; j < records.length; j++) {
          if (urls.indexOf(records[j].url) === -1) {
            db.Trucking.deleteOne({ url: records[j].url }).catch((err) =>
              console.log("ERROR DELETING URL LINE 82", err)
            );
          }
        }
      })
      .catch((err) =>
        console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 85", err)
      );
  }

  res.sendStatus(200).end();
};
