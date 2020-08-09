const router = require("express").Router();
const petroChemicals = require("./petroChemicals");
const trucking = require("./trucking");
const oilAndGas = require("./oilAndGas");
const manufacturing = require("./manufacturing");
const getAll = require("./getAll");

// User routes
router.use('/getAll', getAll);
router.use('/manufacturing', manufacturing);
router.use("/oilAndGas", oilAndGas);
router.use("/petroChemicals", petroChemicals);
router.use("/trucking", trucking);

module.exports = router;
