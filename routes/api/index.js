const router = require("express").Router();
const petroChemicals = require("./petroChemicals");
const trucking = require("./trucking");
const oilAndGas = require("./oilAndGas");

// User routes
router.use("/oilAndGas", oilAndGas)
router.use("/petroChemicals", petroChemicals);
router.use("/trucking", trucking);

module.exports = router;
