const router = require("express").Router();
const route = require('../../controllers/trucking')

router.route("/");

router.get('/', route.getAll);
router.get('/knightSwift', route.knightSwift);

module.exports = router;