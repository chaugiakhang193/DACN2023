const Course = require("../../model/Course")
const Account = require("../../model/Account");
const CloudinaryHelper = require('../../Controller/Middleware/CloudinaryHelper')
const cloudinary = require('cloudinary').v2;

class CourseController {
    // [POST] /course/management/:id/delete
    async DeleteCourse(req,res)
    {   
        try{
            
            const CourseDelete = await Course.findOne({_id: req.params.id});
            const codeCourse = await CourseDelete.codeCourse
            await Course.deleteMany({codeCourse: codeCourse})
            //await CourseDelete.deleteOne({_id: req.params.id});
            res.redirect('back')
        }
        catch(error){
            console.log(error);
            res.send("<h1>Page not found on the server</h1>")
        }
    }

    // [GET] /course/management/:id/edit
    async EditCourse(req, res){
        try{
            const CurrentCourse = await Course.findOne({_id: req.params.id});
            const nameTeacher = req.body.Teacher;
            const TeacherInfo = await Account.findOne({ Realname: nameTeacher, teacher:true});
            
            if(!TeacherInfo){
                res.render("Course/Edit",
                {message: "Can't find this teacher, please try again"});}
            else{
                const Name = req.body.Name;
                const codeCourse = req.body.codeCourse;
                const Description = req.body.Description;
                const TeacherID = TeacherInfo._id;
                
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
                const Now = Date.now();

            //update schema course for teacher
            await CurrentCourse.updateOne({
                Name: Name,
                codeCourse:codeCourse,
                Description: Description,
                idTeacher: TeacherID,
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,
                nameTeacher: nameTeacher,
                DateUpdateAt: Now
            })
            const OldCodeCourse = req.body.OldCodeCourse;
            
            //update schema course for students 
            await Course.updateMany(
                {codeCourse: OldCodeCourse},
                {
                Name: Name,
                codeCourse:codeCourse,
                Description: Description,
                idTeacher: TeacherID,
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,
                nameTeacher: nameTeacher,
                DateUpdateAt: Now
                }
            )
            res.render("Course/Edit",
            {message: "Update Course's information successfully!"});
            }
        }
        catch(error){
            console.log(error.message);
            res.render("Course/Edit",
            {message: "Oh, some thing went wrong"});
        }
    }

    // [GET] /course/management/:id/edit
    async RenderEditForm(req, res){
        try{
            const CurrentCourse = await Course.findOne({_id: req.params.id});
            const id = CurrentCourse._id;
            const Name = CurrentCourse.Name;
            const codeCourse = CurrentCourse.codeCourse;
            const Description = CurrentCourse.Description;
            const Teacher = CurrentCourse.nameTeacher;
            const OldCodeCourse = CurrentCourse.codeCourse;
            res.render("Course/Edit",
            {Name: Name, codeCourse: codeCourse, Description: Description, Teacher:Teacher, id:id, OldCodeCourse:OldCodeCourse});
        }
        catch(error){
            res.render("Course/Edit",
            {message: "This course not exist, please try again"});
        }
    }

    // [GET] /course/management/course-already-create 
    CourseAlreadyCreate(req, res) {
        const CurrentUserID = req.cookies.User._id;
        
        let CourseInfo =  Course.find({idAuthor:CurrentUserID, IsStudent:false})
        
        CourseInfo.sort({
            DateCreateAt: 'desc'
        })
        .then(CourseS =>{
            
            CourseS = CourseS.map(Course=>Course.toObject()) 
            res.render("Course/CourseAlreadyCreate", {CourseS});
        })
        
    }

    // [GET] /course/management/current-course
    CurrentCourse(req, res) {
        const CurrentUserID = req.cookies.User._id;
        
        let CourseInfo =  Course.find({idTeacher:CurrentUserID, IsStudent:false})
        
        CourseInfo.sort({
            DateCreateAt: 'desc'
        })
        .then(CourseS =>{
            
            CourseS = CourseS.map(Course=>Course.toObject()) 
            res.render("Course/CourseAlreadyCreate", {CourseS});
        })
        
    }

    // [GET] /course/management/current-course/:codeCourse/upload-video
    UploadVideoForm(req,res){
        const codeCourse = req.params.codeCourse
        res.render("Course/UploadVideo", {codeCourse:codeCourse});
    }

    // [POST] /course/management/current-course/:codeCourse/upload-video
    UploadVideo(req,res){
        //write function upload video with cloudninary here + create model for video each course 
        //research how to use
        //maybe import cloudinary in Course controller file, maybe
        const fileData = req.file.path

        cloudinary.uploader
        .upload(fileData, 
             { resource_type: "video", 
                public_id: "courses",
                chunk_size: 6000000,
                eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
                eager_async: true,
                eager_notification_url: "https://mysite.example.com/notify_endpoint" })
        .then(result=>console.log(result));
                
        if(!fileData){
            console.log("No file data") 
        }
        else{
            console.log(fileData);
        res.send("Successfully uploaded")
        }

    }

    // [GET] /course/management/current-course
    async CurrentCourseDetail(req, res) {
        const CurrentUserID = req.cookies.User._id;
        const codeCourse = req.params.codeCourse

        let CourseInfo =  await Course.findOne({idTeacher:CurrentUserID, IsStudent:false, codeCourse:codeCourse})

        const Name = CourseInfo.Name;
        const Description = CourseInfo.Description;

        res.render("Course/CourseDetail", {codeCourse: codeCourse, Name: Name, Description: Description});
    }

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
        const Teacher = await Account.findOne({_id : idAuthor});
        const nameTeacher = Teacher.Realname;
        const nameAuthor = nameTeacher;
        console.log(nameAuthor);
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
                idTeacher: idAuthor,
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,
                nameTeacher: nameTeacher,
                nameAuthor: nameAuthor,
            } 
            await Course.insertMany([data]);
            res.render("Course/CreateCourse",{message: "You have successfully create a course!"});
        }catch(error){
            res.render("Course/CreateCourse",{message: "You have failed create a course!"});
        }
    }
    


    //[GET] /course/management  
    ListManagement(req, res) {
        res.render("Course/ListManagement")
    }
}

module.exports = new CourseController;