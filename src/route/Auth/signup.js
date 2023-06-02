const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');

const SignUpController = require('../../Controller/Auth/SignUpController');
// [GET] /signup
router.get('/',Middleware.VerifyTokenandTeacher ,SignUpController.RenderSignUp)
//[POST] /signup
router.post('/', SignUpController.Register)

module.exports = router;
