var express 	= require('express');
var controller 	= require('../controllers/deposits');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
router.post('/process', middleware.isLogin, controller.processDeposit);

module.exports = router;