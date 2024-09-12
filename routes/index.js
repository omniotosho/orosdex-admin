var express 	= require('express');
var controller  = require('../controllers/index');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isActive, controller.index);

module.exports = router;