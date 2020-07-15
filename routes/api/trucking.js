const router = require("express").Router();
const route = require('../../controllers/trucking')

router.route("/");

router.get('/', route.getAll);
router.get('/knightSwift', route.knightSwift);
router.get('/pilotFlyingJ', route.pilotFlyingJ);
router.delete("/:id", route.delete);
router.put("/:id", route.handleSeen);

module.exports = router;