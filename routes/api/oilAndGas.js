const router = require("express").Router();
const route = require('../../controllers/oilAndGas')

// Matches with "/api/petroChemicals"
router.route("/");

router.get('/', route.getAll);

router.get("/halliburton", route.halliburton);

router.get("/schlumberger", route.schlumberger);

router.put("/handleSeen", route.handleSeen);

router.put("/handleDelete/:id", route.handleDelete);

module.exports = router;