var express 	= require('express');
var controller 	= require('../controllers/dashboard');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.dashboard);

module.exports = router;