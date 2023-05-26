const express = require('express');
const router = express.Router();

const ForgetController  = require('../../Controller/Auth/ForgetController');

// [GET] /forget
router.get('/', ForgetController.RenderForget)
//[POST] /forget
router.post('/', ForgetController.ForgotPassword.bind(ForgetController))


//[GET] /forget/reset-password
router.get('/reset-password', ForgetController.RenderResetPassword)
//[POST] /forget/reset-password
router.post('/reset-password', ForgetController.ResetPassword)

module.exports=router;