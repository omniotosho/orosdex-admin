var express 	    = require('express');
var authentication  = require('../controllers/authentication');
var router 		    = express.Router();

// Routes related to event
router.post('/signin', authentication.signinUser);
router.post('/signup', authentication.signupUser);
router.post('/send-reset-link', authentication.sendResetLink);
router.post('/reset-password', authentication.resetPassword);
router.post('/send-activation-link', authentication.sendActivationLink);
router.get('/activate-account', authentication.activateAccount)
router.post('/verify/email', authentication.verifyEmail);
// router.post('/init/system/account', authentication.initSystemDefault);

module.exports = router;