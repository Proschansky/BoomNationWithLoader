const router = require("express").Router();
const route = require('../../controllers/trucking')

router.route("/");

router.get('/', route.getAll);
router.get('/knightSwift', route.knightSwift);
router.get('/pilotFlyingJ', route.pilotFlyingJ);
router.put("/handleDelete/:id", route.handleDelete);
router.put("/:id", route.handleSeen);

module.exports = router;