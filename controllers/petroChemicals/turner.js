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

    const date = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName('job-items'), (ul)=>
         ul.children[0].innerText)
    });

    const location = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName('job-items'), (ul)=>
         ul.children[1].innerText)
    });

    const unorderListItems = await page.evaluate(() =>{
      return Array.from(document.getElementsByTagName('ul'), ul=>{
        let arr = []
        for(let i = 3; i < ul.children.length; i++){
          arr.push(ul.children[i].innerText);
        }
        return arr;
      })
    })

    const paragraphs = await page.evaluate(() =>{
      return Array.from(document.getElementsByTagName('p'), p=>{
        let arr = []
        for(let i = 0; i < p.children.length; i++){
          arr.push(p.children[i].innerText);
        }
        return arr;
      })
    })

    job.url = filteredUrls[i];
    job.jobType = header[0];
    job.datePosted = date[0];
    job.workLocations = location[0];
    job.skillsAndExperience = unorderListItems[2];
    job.jobDescription = paragraphs[0].join();
    job.essentialFunctions = paragraphs[1].join();
    job.company = "Turner Industries";
    
    //Creating the new record in the database, for those records, which don't yet exist.
    db.Petrochemicals.findOne({url: job.url}).then(res => {
      if(!res){
        db.Petrochemicals.create({
          company: job.company,
          datePosted: job.datePosted,
          essentialFunctions: job.essentialFunctions,
          jobClassification: job.jobClassification,
          jobDescription: job.jobDescription,
          jobType: job.jobType,
          skillsAndExperience: job.skillsAndExperience,
          url: job.url,
          workLocations: job.workLocations
        }).catch((err) => console.log(err));
      } 
    })

     //Removing jobs no longer posted on the website from our collection.
     db.Petrochemicals.find().then(records=>{
      
      for(let j = 0; j < records.length; j++){
        if(urls.indexOf(records[j].url) === -1){
          db.Petrochemicals.updateOne({url: records[j].url},{deleted: true}).catch(err => console.log("ERROR DELETING URL LINE 97", err))
        }
      }
    }).catch(err => console.log("ERROR FINDING PETROCHEMICAL RECORDS LINE 100", err))
  }


  res.sendStatus(200).end();

};
