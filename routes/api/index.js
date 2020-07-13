const router = require("express").Router();
const petroChemicals = require("./petroChemicals");

// User routes
router.use("/petroChemicals", petroChemicals);

module.exports = router;
