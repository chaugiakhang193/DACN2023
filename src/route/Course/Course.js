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

// [GET] /course/:codeCourse/upload-video
router.get('/:codeCourse/upload-video',Middleware.VerifyTokenandTeacher , CourseController.UploadVideoForm)

// [GET] /course/management/:id/edit
router.get('/management/:id/edit', Middleware.VerifyTokenandTeacher ,CourseController.RenderEditForm)

// [POST] /course/management/:id/delete
router.post('/management/:id/delete', Middleware.VerifyTokenandTeacher ,CourseController.DeleteCourse)

// [POST] /course/management/:id/edit
router.post('/management/:id/edit', Middleware.VerifyTokenandTeacher ,CourseController.EditCourse)

// [GET] /course/view-video/:id
router.get('/view-video/:id', Middleware.VerifyToken ,CourseController.ViewAVideo)

// [POST] /course/delete-comment/:id
router.post('/delete-comment/:id', Middleware.VerifyToken ,CourseController.DeleteComment)

//[GET] [TEMP]  /course/edit-comment/:id  
router.get('/edit-comment/:id', Middleware.VerifyToken ,CourseController.RenderEditCommentForm)

//[POST] [TEMP]  /course/edit-comment/:id  
router.post('/edit-comment/:id', Middleware.VerifyToken ,CourseController.EditComment)

// [POST] /course/:idCourse/upload-comment
router.post('/:idCourse/upload-comment', Middleware.VerifyToken ,CourseController.UploadComment)

// [POST] course/:codeCourse/upload-video
router.post('/:codeCourse/upload-video', Middleware.VerifyTokenandTeacher ,CloudinaryHelper.single('mp4'),CourseController.UploadVideo)

// [GET] /course/create-course [TEMP]
router.get('/management', Middleware.VerifyTokenandTeacher ,CourseController.ListManagement)

// [GET] /course/:codeCourse
router.get('/:codeCourse', Middleware.VerifyToken ,CourseController.CourseDetail)

module.exports = router;
