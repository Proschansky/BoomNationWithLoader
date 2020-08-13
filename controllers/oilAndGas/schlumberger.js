const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  res.sendStatus(200);
  const homePage = "https://careers.slb.com/job-listing";

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
      return Array.from(document.getElementsByTagName('a'), (a)=>a.getAttribute('href'));
    });
  };

  const urls = await hrefs();
  
  const filteredUrls = urls.filter((link) => {
    if (link) {
      const jobsLink = "https://xjobs.brassring.com/";
      return link.substring(0, jobsLink.length) === jobsLink;
    }
  });

    for (let i = 0; i < filteredUrls.length; i++) {
      await page.goto(filteredUrls[i]);
      const job = {};
      job.company = "Schlumberger";
      job.url = filteredUrls[i];

      const header = await page.evaluate(() => {
        return Array.from(
          document.getElementsByClassName("jobtitleInJobDetails"),
          (h1) => h1.innerText
        );
      });

      const paragraphs = await page.evaluate(() => {
        return Array.from(
          document.getElementsByClassName("answer"),
          (p) => p.innerText
        );
      });

      job.jobDescription = paragraphs[1];
      job.jobTitle = header[0];
      job.skillsAndExperience = paragraphs[2];
      job.workLocations = paragraphs[11] + " " + paragraphs[10];

      //Creating the new record in the database, for those records, which don't yet exist.
      db.OilAndGas.findOne({ url: job.url }).then((res) => {
        if (!res) {
          db.OilAndGas.create({
            company: job.company,
            jobDescription: job.jobDescription,
            jobTitle: job.jobTitle,
            url: job.url,
            workLocations: job.workLocations,
            skillsAndExperience: job.skillsAndExperience
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
              ).catch((err) => console.log("ERROR DELETING URL LINE 77", err));
            }
          }
        })
        .catch((err) =>
          console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 82", err)
        );
    }
};
