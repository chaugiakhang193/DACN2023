const Course = require("../../model/Course")
const Account = require("../../model/Account");
const moment = require ("moment")


class StudentController {   
    // [GET] student/courses
    async Courses(req,res){
        const CurrentUserID =await req.cookies.User._id;

        let CourseInfo =   Course.find({idStudent:CurrentUserID})
        
        CourseInfo.sort({
            DateCreateAt: 'desc'
        })
        .then(CourseS =>{
            
            CourseS = CourseS.map(Course=>Course.toObject()) 
            res.render("Student/Courses", {CourseS});
        })
    }

    //[POST] student/dkhp/:id/delete
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
            const MSSV = SVInfo.name;

            

            if(checkAlreadyCourse){
                res.send("Bạn đã đăng ký khoá học này rồi!");
                //res.render("Student/dkhp",{message: "You already registered this course"});
            }
            else{
                try{
                    const SVInfo = await Account.findOne({_id: CurrentUserID})
            
                    
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
                    //format date data to dd/mm/yyyy
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    let mm = today.getMonth() + 1; 
                    let dd = today.getDate();
                        
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                        
                    const formattedToday = dd + '/' + mm + '/' + yyyy;   

                    const CreateAt = formattedToday + " - " + moment().format('LT');
                    const UpdateAt = formattedToday + " - " + moment().format('LT');
                    
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
                            CreateAt: CreateAt,
                            UpdateAt: UpdateAt,
                            MSSV: MSSV,
                            
                        } 
                        await Course.insertMany([data]);
                        //res.render("Student/dkhp",{message: "You have successfully register a course!"});
                        res.redirect("/student/mon-da-dang-ky"); 
                    }catch(error){
                        res.send("Đăng ký thất bạn, hãy thử lại bạn nhé!");
                        //res.render("Student/dkhp",{message: "You have failed register a course!"});
                    }
            }
        }
        catch(error){
            res.send("Không thể tìm thấy khoá học này")
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