const express = require('express');
const router = express.Router();

const CourseController = require('../../Controller/Course/CourseController')
// [GET] /course/create-course
router.get('/create-course', CourseController.RenderCreateCourse)

module.exports = router;
