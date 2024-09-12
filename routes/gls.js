var express 	= require('express');
var controller 	= require('../controllers/gls');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
// router.post('/', middleware.isLogin, controller.addOne);

module.exports = router;