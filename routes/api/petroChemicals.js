const router = require("express").Router();
const route = require('../../controllers/petroChemicals')

// Matches with "/api/petroChemicals"
router.route("/");

router.get('/', route.getAll);

router.get("/zachry", route.zachry);

router.get("/turner", route.turner);

router.put("/handleDelete/:id", route.handleDelete);

router.put("/:id", route.handleSeen);

module.exports = router;