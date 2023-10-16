const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController')
const CloudinaryHelper = require('../../Controller/Middleware/CloudinaryHelper')


const CourseController = require('../../Controller/Course/CourseController')
// [GET] /course/create-course
router.get('/create-course', Middleware.VerifyTokenandTeacher ,CourseController.RenderCreateCourse)

// [POST] /course/create-course
router.post('/create-course', Middleware.VerifyTokenandTeacher ,CourseController.CreateCourse)

// [GET] /course/management/course-already-create 
router.get('/management/course-already-create', Middleware.VerifyTokenandTeacher ,CourseController.CourseAlreadyCreate)

// [GET] /course/management/current-course
router.get('/management/current-course', Middleware.VerifyTokenandTeacher ,CourseController.CurrentCourse)

// [GET] /course/management/current-course/:codeCourse/upload-video
router.get('/management/current-course/:codeCourse/upload-video',Middleware.VerifyTokenandTeacher , CourseController.UploadVideoForm)

// [POST] /course/management/current-course/:codeCourse/upload-video
router.post('/management/current-course/:codeCourse/upload-video', Middleware.VerifyTokenandTeacher ,CloudinaryHelper.single('mp4'),CourseController.UploadVideo)

// [GET] /course/management/current-course/:codeCourse
router.get('/management/current-course/:codeCourse', Middleware.VerifyTokenandTeacher ,CourseController.CurrentCourseDetail)

// [GET] /course/management/:id/edit
router.get('/management/:id/edit', Middleware.VerifyTokenandTeacher ,CourseController.RenderEditForm)

// [POST] /course/management/:id/delete
router.post('/management/:id/delete', Middleware.VerifyTokenandTeacher ,CourseController.DeleteCourse)

// [POST] /course/management/:id/edit
router.post('/management/:id/edit', Middleware.VerifyTokenandTeacher ,CourseController.EditCourse)

// [GET] /course/create-course
router.get('/management', Middleware.VerifyTokenandTeacher ,CourseController.ListManagement)
module.exports = router;
