const express = require('express');
const router = express.Router();

const loginController = require('../../Controller/Auth/LoginController')
// [GET] /login
router.get('/', loginController.RenderLogin)
//[POST] /login
router.post('/', loginController.Authentication.bind(loginController))

module.exports = router;
