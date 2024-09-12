var express 	= require('express');
var controller 	= require('../controllers/customer');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
router.get('/all', middleware.isLogin, controller.fetchAll);
router.post('/', middleware.isLogin, controller.add);
router.post('/update', middleware.isLogin, controller.updateOne);

module.exports = router;