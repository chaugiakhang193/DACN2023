const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController')

const StudentController = require('../../Controller/Student/StudentController');

//[GET] student/dang-ky-khoa-hoc
router.get('/dang-ky-khoa-hoc',StudentController.RenderDKHP)

//[GET] student/mon-da-dang-ky
router.get('/mon-da-dang-ky', Middleware.VerifyTokenandStudent ,StudentController.RenderSuccessRegister)

//[GET] student/
router.get('/courses', Middleware.VerifyTokenandStudent ,StudentController.Courses)

//[POST] student/dkhp/:id/delete
router.post('/dkhp/:id/delete', Middleware.VerifyTokenandStudent ,StudentController.DKHPDelete)

//[POST] student/dkhp/:id
router.post('/dkhp/:id', Middleware.VerifyTokenandStudent ,StudentController.DKHP)

module.exports = router;
