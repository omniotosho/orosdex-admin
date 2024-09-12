var express 	= require('express');
var controller 	= require('../controllers/uploads');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.post('/excel/files', middleware.isLogin, controller.index);

module.exports = router;