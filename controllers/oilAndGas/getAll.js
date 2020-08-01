const db = require("../../models");

module.exports = async (req, res)=>{
    let jobListings;
    await db.OilAndGas.find().then(res => jobListings = res)
    res.json(jobListings)
};