var express 	= require('express');
var controller 	= require('../controllers/auctions');
var middleware 	= require('../middlewares/authenticate-middleware');
var router 		= express.Router();

// Routes related to event
router.get('/', middleware.isLogin, controller.index);
router.post('/equities', middleware.isLogin, controller.postEquityPrices);
router.get('/equities', middleware.isLogin, controller.getEquityPrices);
router.post('/etfs', middleware.isLogin, controller.postEtfsPrices);
router.get('/etfs', middleware.isLogin, controller.getEtfsPrices);
router.post('/treasury', middleware.isLogin, controller.postTreasuryPrices);
router.get('/treasury', middleware.isLogin, controller.getTreasuryPrices);
router.post('/bonds', middleware.isLogin, controller.postBondsPrices);
router.get('/bonds', middleware.isLogin, controller.getBondsPrices);

module.exports = router;