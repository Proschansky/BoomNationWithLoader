const router = require("express").Router();
const route = require('../../controllers/oilAndGas')

// Matches with "/api/petroChemicals"
router.route("/");

router.get('/', route.getAll);

router.get("/halliburton", route.halliburton);

module.exports = router;