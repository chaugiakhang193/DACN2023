const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');
const Home = require('../../Controller/Home/HomeController')
// [GET] /home
router.get('/', Middleware.VerifyTokenandTeacher ,Home.RenderHome)

module.exports = router;
