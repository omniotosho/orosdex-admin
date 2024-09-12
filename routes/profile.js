var express 	= require('express');
var controller 	= require('../controllers/profile');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
router.get('/user/:user_id', controller.fetchProfile);
router.get('/basic/:user_id', controller.fetchBasic);
router.put('/avatar/:user_id', controller.updateAvatar);
router.get('/bank/:user_id', controller.fetchUserBank);
router.post('/bank/:user_id', controller.updateUserBank);
router.post('/password/:user_id', controller.changePassword);
router.post('/', controller.updateProfile);

module.exports = router;