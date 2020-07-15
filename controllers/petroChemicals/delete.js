const db = require("../../models");

module.exports = async (req, res) =>{
    const _id = req.params.id;

    try{
        
        db.Petrochemicals.findByIdAndDelete(_id).then(res => {
            if(res === null){
                console.log(`RECORD ALREADY DELETED`)
            } else {
                console.log(`RECORD WITH ID ${_id} DELETED`)
            }
        })
    
        res.sendStatus(200);
    } catch (e){
        console.log("ERROR DELETING RECORD", e);
        res.sendStatus(500);
    }

}