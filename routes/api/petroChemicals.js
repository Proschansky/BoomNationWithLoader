const router = require("express").Router();
const route = require('../../controllers/petroChemicals')

// Matches with "/api/petroChemicals"
router.route("/");

router.get('/', route.getAll);

router.get("/zachry", route.zachry);

router.get("/turner", route.turner);

router.delete("/:id", route.delete);

router.put("/:id", route.handleSeen);

module.exports = router;