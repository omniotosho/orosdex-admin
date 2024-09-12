var express 	= require('express');
var controller 	= require('../controllers/loans');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
router.post('/add', middleware.isLogin, controller.addOne);
router.get('/all', middleware.isLogin, controller.fetchAll);

module.exports = router;