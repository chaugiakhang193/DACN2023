const Course = require("../../model/Course")
const Account = require("../../model/Account");


class StudentController {   

    async DKHPDelete(req, res) {
        const CurrentUserID =await req.cookies.User._id;
        const CurrentCourseID = req.params.id;
        await Course.deleteOne({_id: CurrentCourseID, idStudent: CurrentUserID});
        res.redirect('back');
    }

    //[GET] student/dkhp/mon-da-dang-ky
    async RenderSuccessRegister(req, res) {
        const CurrentUserID =await req.cookies.User._id;

        let CourseInfo =   Course.find({idStudent:CurrentUserID})
        
        CourseInfo.sort({
            DateCreateAt: 'desc'
        })
        .then(CourseS =>{
            
            CourseS = CourseS.map(Course=>Course.toObject()) 
            res.render("Student/SuccessRegister", {CourseS});
        })
    }


    //[POST] /student/dkhp/:id
    async DKHP(req, res) {
        try{
            const CourseID =await req.params.id;
            const CurrentCourse = await Course.findOne({_id: CourseID});

            //check xem sinh vien da dang ky khoa hoc nay chua, tranh trung lap;
            const CurrentUserID = await req.cookies.User._id;
            const checkAlreadyCourse = await Course.findOne({codeCourse: CurrentCourse.codeCourse,idStudent :CurrentUserID})
            //tim ten sv 
            const SVInfo = await Account.findOne({_id: CurrentUserID})
            const SVName = SVInfo.Realname;

            if(checkAlreadyCourse){
                res.send("You already registered this course");
                //res.render("Student/dkhp",{message: "You already registered this course"});
            }
            else{
                try{
                    const Name = CurrentCourse.Name;
                    const codeCourse = CurrentCourse.codeCourse;
                    const Description = CurrentCourse.Description;
                    const idAuthor = CurrentCourse.idAuthor;
                    const idTeacher = CurrentCourse.idTeacher
                    const nameTeacher = CurrentCourse.nameTeacher;
                    const nameAuthor = CurrentCourse.nameAuthor;
                    const StartAt = CurrentCourse.StartAt;
                    const EndAt = CurrentCourse.EndAt;
                    const DateStartAt = CurrentCourse.DateStartAt;
                    const DateEndAt = CurrentCourse.DateEndAt;
                    const idStudent = CurrentUserID;
                    const nameStudent = SVName;
                    //console.log(nameAuthor);
                    //Start Time 
                    
                        const data =
                        {   
                            Name: Name,
                            codeCourse:codeCourse,
                            Description: Description,
                            idAuthor: idAuthor,
                            idTeacher: idTeacher,
                            StartAt: StartAt,
                            DateStartAt: DateStartAt,
                            EndAt: EndAt,
                            DateEndAt: DateEndAt,
                            nameTeacher: nameTeacher,
                            nameAuthor: nameAuthor,
                            IsStudent:true,
                            idStudent: idStudent,
                            nameStudent: nameStudent,
                        } 
                        await Course.insertMany([data]);
                        //res.render("Student/dkhp",{message: "You have successfully register a course!"});
                        res.redirect("/student/dkhp/mon-da-dang-ky"); 
                    }catch(error){
                        res.send("You have failed register a course!");
                        //res.render("Student/dkhp",{message: "You have failed register a course!"});
                    }
            }
        }
        catch(error){
            res.send("Sorry, can not find this course, please try again")
        }

}

    //[GET] /student/dkhp
    RenderDKHP(req, res) {
        let CourseInfo =  Course.find({IsStudent:false})
        
        CourseInfo.sort({
            DateCreateAt: 'desc'
        })
        .then(CourseS =>{
            
            CourseS = CourseS.map(Course=>Course.toObject()) 
            res.render("Student/dkhp", {CourseS});
        })
    }
     
}

module.exports = new StudentController;