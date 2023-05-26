const express = require('express');
const router = express.Router();

const SignUpController = require('../../Controller/Auth/SignUpController');
// [GET] /signup
router.get('/', SignUpController.RenderSignUp)
//[POST] /signup
router.post('/', SignUpController.Register)

module.exports = router;
