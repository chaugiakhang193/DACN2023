const Course = require("../../model/Course")

class CourseController {

    //[GET] /course/create-course
    RenderCreateCourse(req, res) {
        res.render("Course/CreateCourse")
    }

    //[POST] /course/create-course
    async CreateCourse(req, res) {
       try{
        const Name = req.body.Name;
        const codeCourse = req.body.codeCourse;
        const Description = req.body.Description;
        const idAuthor = req.cookies.User._id;


        //Start Time 
        var DayStart = req.body.DayStart;
        var MonthStart = req.body.MonthStart;
        const YearStart = req.body.YearStart;
        //format Start Time
        if (DayStart < 10) DayStart = '0' + DayStart;
        if (MonthStart < 10) MonthStart = '0' + MonthStart;
        const StartAt = DayStart + "/" + MonthStart + "/" + YearStart;

        var Temp = YearStart + "-" + MonthStart + "-" + DayStart 
        var DateStartAt = new Date(Temp)
        


        //End Time
            var DayEnd = req.body.DayEnd;
            var MonthEnd = req.body.MonthEnd;
            const YearEnd = req.body.YearEnd;
            //format End Time
            if (DayEnd < 10) DayEnd = '0' + DayEnd;
            if (MonthEnd < 10) MonthEnd = '0' + MonthEnd;  
            const EndAt = DayEnd + "/" + MonthEnd + "/" + YearEnd;
            var Temp = YearEnd + "-" + MonthEnd + "-" + DayEnd; 
            var DateEndAt = new Date(Temp)
        

            const data =
            {   
                Name: Name,
                codeCourse:codeCourse,
                Description: Description,
                idAuthor: idAuthor,
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,

            } 
            await Course.insertMany([data]);
            res.render("Course/CreateCourse",{message: "You have successfully create a course!"});
        }catch(error){
            res.render("Course/CreateCourse",{message: "You have failed create a course!"});
        }
    }
    
}

module.exports = new CourseController;