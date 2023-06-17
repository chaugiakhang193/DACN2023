const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController')


const CourseController = require('../../Controller/Course/CourseController')
// [GET] /course/create-course
router.get('/create-course', Middleware.VerifyTokenandTeacher ,CourseController.RenderCreateCourse)

// [GET] /course/create-course
router.post('/create-course', Middleware.VerifyTokenandTeacher ,CourseController.CreateCourse)

module.exports = router;
