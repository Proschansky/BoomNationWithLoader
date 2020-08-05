const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const homePage =
    "https://jobs.pilotflyingj.com/drivers?page_size=250&page_number=1&sort_by=headline&sort_order=ASC&custom_categories=Driver%20Position&custom_categories=All%20Driver%20Positions&custom_categories=DEF%20Driver%20Position&custom_categories=PFJ%20Crude%20Driver&custom_categories=Driver%20Positions&custom_categories=All%20Driver%20Jobs";

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
    return (
      link.substring(0, classA.length) === classA ||
      link.substring(0, truckCare.length) === truckCare
    );
  });

  res.sendStatus(200);

  for (let i = 0; i < filteredUrls.length; i++) {
    await page.goto(`https://jobs.pilotflyingj.com${filteredUrls[i]}`);
    const job = {};
    job.company = "Pilot Flying J";
    job.url = `https://jobs.pilotflyingj.com${filteredUrls[i]}`;

    const jobTitle = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName("job-title"), (title) =>
        title.innerText.split("\n")
      );
    });

    const locationLabel = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("location__label"),
        (label) => label.textContent
      );
    });

    const date = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("date"),
        (label) => label.textContent
      );
    });

    const jobRef = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("job-ref"),
        (label) => label.textContent
      );
    });

    job.jobType = jobTitle[0][0];
    job.jobClassification = "Trucking";
    job.workLocations = locationLabel[0];
    job.datePosted = date[0].slice(8, date[0].length);
    job.internalId = jobRef[0].slice(16, jobRef[0].length);

    const jobDescription = await page.evaluate(() => {
      return Array.from(
        document.getElementsByClassName("job-description-content"),
        (desc) => {
          let arr = [];
          for (let i = 0; i < desc.children.length; i++) {
            arr.push(desc.children[i].textContent);
          }

          return arr;
        }
      );
    });

    if (job.jobType !== "Truck Care") {
      job.benefits = jobDescription[0][1].split("\n").slice(1, 11);
    } else {
      const jobDesc = jobDescription[0].filter((item) => item !== "");
      job.benefits = jobDesc.slice(0, 6);
      job.essentialFunctions = jobDesc[9];
      job.desiredQualifications = jobDesc[10];
      job.skillsAndExperience = jobDesc.slice(13, jobDesc.length);
    }

    //Creating the new record in the database, for those records, which don't yet exist.
    db.Trucking.findOne({ url: job.url }).then((resp) => {
      if (!resp) {
        db.Trucking.create({
          company: job.company,
          url: job.url,
          jobClassification: job.jobClassification,
          workLocations: job.workLocations,
          datePosted: job.datePosted,
          internalId: job.internalId,
          benefits: job.benefits,
          essentialFunctions: job.essentialFunctions,
          desiredQualifications: job.desiredQualifications,
          skillsAndExperience: job.skillsAndExperience,
        }).catch((err) => console.log(err, job.url));
      }
    });

    //Removing jobs no longer posted on the website from our collection.
    db.Trucking.find()
      .then((records) => {
        for (let j = 0; j < records.length; j++) {
          if (urls.indexOf(records[j].url) === -1) {
            db.Trucking.updateOne(
              { url: records[j].url },
              { deleted: true }
            ).catch((err) => console.log("ERROR DELETING URL LINE 82", err));
          }
        }
      })
      .catch((err) =>
        console.log("ERROR FINDING TRUCKING RECORDS LINE 85", err)
      );
  }

};
