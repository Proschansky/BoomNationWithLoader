const db = require("../../models");

module.exports = async (req, res) =>{
    const _id = req.params.id;

    try{
        
        db.Petrochemicals.findOneAndUpdate({_id: _id},{new: false}).then(res => {
            console.log(`RECORD UPDATED WITH ID ${_id}`);
        })
    
        res.sendStatus(200);
    } catch (e){
        console.log("ERROR UPDATIING RECORD", e);
        res.sendStatus(500);
    }

}