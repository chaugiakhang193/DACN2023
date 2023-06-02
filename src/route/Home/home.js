const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');
const Home = require('../../Controller/Home/HomeController')
// [GET] /home
router.get('/', Middleware.VerifyToken ,Home.RenderHome)

module.exports = router;
