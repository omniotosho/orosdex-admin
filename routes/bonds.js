var express 	= require('express');
var controller 	= require('../controllers/bonds');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);

module.exports = router;