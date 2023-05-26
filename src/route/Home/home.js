const express = require('express');
const router = express.Router();

const Home = require('../../Controller/Home/HomeController')
// [GET] /home
router.get('/', Home.RenderHome)

module.exports = router;
