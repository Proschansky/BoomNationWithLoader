const db = require("../../models");
const puppeteer = require("puppeteer");

module.exports = async (req, res)=>{
  
  const homePage = "https://turnerindustries.applicantpro.com/jobs/";

  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const hrefs = async () => {
    await page.goto(homePage);

    return await page.evaluate(() =>{
      return Array.from(document.getElementsByTagName('a'), (a)=>a.getAttribute('href'));
    });
  };

  const urls = await hrefs();

  const filteredUrls = urls.filter((link =>{
      const jobsLink = "https://turnerindustries.applicantpro.com/jobs";
      return link.substring(0,jobsLink.length) === jobsLink;
  }))

  for(let i = 0; i < filteredUrls.length; i++){
    await page.goto(filteredUrls[i]);
    const job = {};
    
    const header = await page.evaluate(() =>{
        return Array.from(document.getElementsByTagName('h1'), (h1)=>h1.innerText);
    });

    const listItems = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName('job-items'), (ul)=>
         ul.children[0].innerText)
    });

    job.url = filteredUrls[i];
    job.jobDescription = header;
    
  }

  res.sendStatus(200).send("OK");

};
