const router = require("express").Router();
const petroChemicals = require("./petroChemicals");
const trucking = require("./trucking")

// User routes
router.use("/petroChemicals", petroChemicals);
router.use("/trucking", trucking);

module.exports = router;
