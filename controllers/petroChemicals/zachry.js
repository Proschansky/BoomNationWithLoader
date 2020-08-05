const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const homePage = "https://zachryconstructioncorporation.ourcareerpages.com/";

  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const hrefs = async () => {
    await page.goto(homePage);

    return await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]"), (a) =>
        a.getAttribute("href")
      )
    );
  };

  const urls = await hrefs();

  const actualUrls = urls.filter((url) => url !== "#");

  for (let i = 0; i < actualUrls.length; i++) {
    await page.goto(actualUrls[i]);

    const job = {};

    const headers = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h2"), (header) => header.innerHTML)
    );

    job.company = headers[0].trim();
    job.jobDescription = headers[1].trim();
    job.url = actualUrls[i].trim();
    job.workLocations = await page.evaluate(() => {
      return document.querySelector(".job_location").innerText.trim();
    });
    job.jobType = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("p"),
        (par) => par.innerText
      )[1];
    });
    job.essentialFunctions = await page
      .evaluate(() => {
        return Array.from(
          document.querySelector("ul").children,
          (child) => child.innerText
        );
      })
      .catch(() => {
        return "ESSENTIAL FUNCTIONS";
      });
    job.skillsAndExperience = await page
      .evaluate(() => {
        return Array.from(
          document.querySelectorAll("ul")[1].children,
          (child) => child.innerText
        );
      })
      .catch(() => {
        return "SKILLS";
      });
    job.benefits = await page
      .evaluate(() => {
        return Array.from(
          document.querySelectorAll("ul")[2].children,
          (child) => child.innerText
        );
      })
      .catch(() => {
        return "BENEFITS";
      });
    
    //Creating the new record in the database, for those records, which don't yet exist.
    db.Petrochemicals.findOne({url: job.url}).then(res => {
      if(!res){
        db.Petrochemicals.create({
          company: job.company,
          classification: job.jobClassification,
          jobDescription: job.jobDescription,
          url: job.url,
          workLocations: job.workLocations,
          jobType: job.jobType,
          essentialFunctions: job.essentialFunctions,
          skillsAndExperience: job.skillsAndExperience,
          benefits: job.benefits,
        }).catch((err) => console.log(err));
      } 
    })

    //Setting all job records to deleted, if their urls are no longer on the website
    db.Petrochemicals.find().then(records=>{
      
      for(let j = 0; j < records.length; j++){
        if(urls.indexOf(records[j].url) === -1){
          console.log(records[j].url)
          db.Petrochemicals.updateOne({url: records[j].url},{deleted: true}).catch(err => console.log("ERROR DELETING URL LINE 101", err))
        }
      }
    }).catch(err => console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 104", err))

  }

  res.sendStatus(200).end();
};
