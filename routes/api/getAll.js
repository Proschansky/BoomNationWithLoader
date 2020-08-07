const db = require("../../models");

module.exports = async (req, res)=>{
    let jobListings = [];
    await db.Manufacturing.find().then(res => jobListings = res)
    .then( await db.Petrochemicals.find().then(res=>{
        jobListings = jobListings.concat(res)
    }))
    .then(await db.Trucking.find().then(res=>{
        jobListings = jobListings.concat(res)
    }))
    .then(await db.OilAndGas.find().then(res=>{
        jobListings = jobListings.concat(res)
    }))

    res.json(jobListings);
    
};