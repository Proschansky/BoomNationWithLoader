const router = require("express").Router();
const route = require('../../controllers/manufacturing')

// Matches with "/api/petroChemicals"
router.route("/");

router.get('/', route.getAll);

router.get("/pepsiCo", route.pepsiCo);

router.put("/handleSeen", route.handleSeen);

module.exports = router;