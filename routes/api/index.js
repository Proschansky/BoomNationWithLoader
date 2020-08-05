const router = require("express").Router();
const petroChemicals = require("./petroChemicals");
const trucking = require("./trucking");
const oilAndGas = require("./oilAndGas");
const manufacturing = require("./manufacturing")

// User routes
router.use('/manufacturing', manufacturing);
router.use("/oilAndGas", oilAndGas);
router.use("/petroChemicals", petroChemicals);
router.use("/trucking", trucking);

module.exports = router;
