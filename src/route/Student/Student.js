const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController')

const StudentController = require('../../Controller/Student/StudentController');

//[GET] student/dkhp
router.get('/dkhp', Middleware.VerifyTokenandStudent ,StudentController.RenderDKHP)

//[GET] student/dkhp/mon-da-dang-ky
router.get('/dkhp/mon-da-dang-ky', Middleware.VerifyTokenandStudent ,StudentController.RenderSuccessRegister)

//[POST] student/dkhp/:id/delete
router.post('/dkhp/:id/delete', Middleware.VerifyTokenandStudent ,StudentController.DKHPDelete)

//[POST] student/dkhp/:id
router.post('/dkhp/:id', Middleware.VerifyTokenandStudent ,StudentController.DKHP)

module.exports = router;
