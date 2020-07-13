const db = require("../../models");

module.exports = async (req, res)=>{
    let jobListings;
    await db.Petrochemicals.find().then(res => jobListings = res)
    res.json(jobListings)
};