
class CourseController {

    //[GET] /course/create-course
    RenderCreateCourse(req, res) {
        res.render("Course/CreateCourse")
    }

    
}

module.exports = new CourseController;