const Course = require("../../model/Course")
const Account = require("../../model/Account");
const Asset = require("../../model/Asset");
const Comment = require("../../model/Comment");
const CloudinaryHelper = require('../../Controller/Middleware/CloudinaryHelper')
const cloudinary = require('cloudinary').v2;
const moment = require ("moment")

class CourseController {
    // [POST] /course/management/:id/delete
    async DeleteCourse(req,res)
    {   
        try{
            
            const CourseDelete = await Course.findOne({_id: req.params.id});
            const codeCourse = await CourseDelete.codeCourse
            await Course.deleteMany({codeCourse: codeCourse})
            await Comment.deleteMany({idCourse : req.params.id})
            await Asset.deleteMany({idOwner : req.params.id})
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
        const message = "HELLO"
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

    // [GET] /course/:codeCourse/upload-video
    async UploadVideoForm(req,res){
        const codeCourse = req.params.codeCourse;
        const CurrentUserID = req.cookies.User._id;
        const CourseInfo =  await Course.findOne({idTeacher:CurrentUserID, IsStudent:false, codeCourse:codeCourse});
        if(!CourseInfo){
            res.send("You not teach this course, can not upload any video. Please contact to the teacher who teach this course.")
        }
        else{
        const codeCourse = req.params.codeCourse
        res.render("Course/UploadVideo", {codeCourse:codeCourse});}
    }

    // [POST] /course/management/current-course/:codeCourse/upload-video
    async UploadVideo(req,res){
        //write function upload video with cloudninary here + create model for video each course 
        //research how to use
        //maybe import cloudinary in Course controller file, maybe
        const fileData = req.file.path
        const Title = req.body.Title
        const Description = req.body.Description
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
        .then(async result=> {
            const CurrentUserID = req.cookies.User._id;
            const codeCourse = req.params.codeCourse;
            let CourseInfo =  await Course.findOne({idTeacher:CurrentUserID, IsStudent:false, codeCourse:codeCourse});
            console.log(CourseInfo._id);
            const DataInformation = 
            {
                Name : req.file.originalname,
                URL : result.url,
                CloudinaryFolder : result.public_id,
                idOwner : CourseInfo._id,
                Title : Title,
                Description: Description,

            }
            await Asset.insertMany([DataInformation]);
        });
                
        if(!fileData){
            console.log("No file data") 
        }
        else{
            console.log(fileData);
        res.send("Successfully uploaded")
        }

    }

    // [POST] /course/:idCourse/upload-comment
    async UploadComment(req, res){
        try{
                const CurrentUserID = req.cookies.User._id;

                const CurrentUserInfo = await Account.findOne({_id: CurrentUserID});
                const AuthorName = CurrentUserInfo.Realname;

               // const codeCourse = req.params.codeCourse;
                //let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse}); 
                const idCourse = req.params.idCourse;

                const Content = req.body.Content;
                //format date time for display
                        const today = new Date();
                        const yyyy = today.getFullYear();
                        let mm = today.getMonth() + 1; 
                        let dd = today.getDate();
                        if (dd < 10) dd = '0' + dd;
                        if (mm < 10) mm = '0' + mm;
                        const formattedToday = dd + '/' + mm + '/' + yyyy;   
                        const CreateAt = formattedToday + " - " + moment().format('LT');

                const Data = {
                    idAuthor: CurrentUserID,
                    RealNameAuthor: AuthorName,
                    idCourse: idCourse,
                    Content: Content,
                    CreateAt: CreateAt,
                }
                await Comment.insertMany([Data]);

                res.redirect('back')}
        catch (error) {
            console.log(error);
            res.send("<h1>Some thing went wrong</h1>")
        }

    }


    // [GET] /course/view-video/:id
    async ViewAVideo(req,res){
        try{
            const idVideo = req.params.id;
            const AVideo = await Asset.findOne({_id:idVideo});
            const idOwner = AVideo.idOwner;
            const CourseInfo = await Course.findOne({_id:idOwner});
            const codeCourse = CourseInfo.codeCourse;
            const CurrentUserID = req.cookies.User._id; 
            const StudentInfo = await Account.findOne({_id: CurrentUserID});
            const CheckStudentAccount = StudentInfo.teacher; //false is student account
            const idAVideo = AVideo._id; 
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID,codeCourse:codeCourse});
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("You have not registered this course yet. Please try again later.");
            }
            const Description = AVideo.Description;
            const Title = AVideo.Title;
            const URL = AVideo.URL;
            let CommentInACourse = Comment.find({idCourse: idAVideo})

            CommentInACourse.sort({
                CreateAt: 'desc'
            }).then(CommentS =>
                {
                    CommentS = CommentS.map(Comment=>Comment.toObject()) 
                    res.render("Course/ViewVideo", 
                        {Description: Description, 
                         Title: Title, 
                         URL: URL,
                         idCourse: idAVideo,
                         CommentS:CommentS,
                        });
                })

            
            
        }
        catch(error){
            console.log(error)
            res.send("<h1>Sorry, this video is not avaible. Please try again later</h1>")
        }
    }

    // [POST] /course/management/current-course/:codeCourse/delete-comment/:id
    async DeleteComment(req, res){
        try{
            const idComment = req.params.id;
            const DeleteComment = await Comment.findOne({_id: idComment})
            const idAuthor = DeleteComment.idAuthor;
            const CurrentUserID = req.cookies.User._id;
            if(CurrentUserID == idAuthor){
                await Comment.deleteOne({_id: idComment});
                res.redirect('back')
            }
            else{
                res.send("This is not your comment, you can not delete this comment")
            }
        }
        catch(error)
        {
            res.send("Some thing went wrong, you can not delete this comment")
        }
    }

    //[GET] [TEMP]  /course/management/current-course/:codeCourse/edit-comment/:id  
    RenderEditCommentForm(req,res){
        const idComment = req.params.id;
        res.render("Comment/EditForm", {id: idComment})
    }

    //[POST] [TEMP]  /course/management/current-course/:codeCourse/edit-comment/:id  
    async EditComment(req,res){
        try{
            const idComment = req.params.id;
            const EditComment = await Comment.findOne({_id: idComment})
            const idAuthor = EditComment.idAuthor;
            const CurrentUserID = req.cookies.User._id;
            const EditContent = req.body.Content;
            const today = new Date();
                        const yyyy = today.getFullYear();
                        let mm = today.getMonth() + 1; 
                        let dd = today.getDate();
                        if (dd < 10) dd = '0' + dd;
                        if (mm < 10) mm = '0' + mm;
                        const formattedToday = dd + '/' + mm + '/' + yyyy;   
                        const CreateAt = formattedToday + " - " + moment().format('LT') + " (Edited)";

            if(CurrentUserID == idAuthor){
                await EditComment.updateOne({
                    Content : EditContent,
                    CreateAt: CreateAt
                })
                res.redirect('back')
            }
            else{
                res.send("This is not your comment, you can not edit this comment")
            }
        }
        catch(error)
        {
            res.send("Some thing went wrong, you can not edit this comment")
        }
    }

    // [GET] /course/:codeCourse
    async CourseDetail(req, res) {
        try{
            const codeCourse = req.params.codeCourse;
            const CurrentUserID = req.cookies.User._id;
            const StudentInfo = await Account.findOne({_id: CurrentUserID});
            const CheckStudentAccount = StudentInfo.teacher; //false is student account
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID, codeCourse:codeCourse});
            
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("You have not registered this course yet. Please try again later.");
            }
            

            

            let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse});

            if(!CourseInfo){
                let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse});
                let AssetInfo = Asset.find({idOwner: CourseInfo._id});
                let idCourse = CourseInfo._id;
              
                const CurrentUserInfo = await Account.findOne({_id: CurrentUserID});
                // username who is comment
                const UserName = CurrentUserInfo.Realname;

                let CommentInACourse = Comment.find({idCourse: CourseInfo._id})

                CommentInACourse.sort({
                    CreateAt: 'desc'
                }).then(CommentS =>
                    {
                        CommentS = CommentS.map(Comment=>Comment.toObject()) 
                        AssetInfo.sort({
                            CreateAt: 'desc'
                        })
                            .then(AssetInfoS =>{
                                
                                AssetInfoS = AssetInfoS.map(AssetInfo=>AssetInfo.toObject()) 
                                res.render("Course/CourseDetail",
                                            {
                                                AssetInfoS:AssetInfoS,
                                                CommentS: CommentS,
                                                idCourse: idCourse,
                                                Name: CourseInfo.Name,
                                                Description: CourseInfo.Description,
                                                UserName:UserName,
                                                codeCourse: codeCourse
                                            }
                                        );
                            })
                    }
                    
                )
            }

            else{
                const StudentInfo = await Account.findOne({_id: CurrentUserID});
                const CheckStudentAccount = StudentInfo.teacher; //false is student account
                const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID, codeCourse:codeCourse});
                if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                    res.send("You have not registered this course yet. Please try again later.");}

                let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse});
                let AssetInfo = Asset.find({idOwner: CourseInfo._id});
                let idCourse = CourseInfo._id;
                const CurrentUserInfo = await Account.findOne({_id: CurrentUserID});
                // username who is comment
                const UserName = CurrentUserInfo.Realname;

                let CommentInACourse = Comment.find({idCourse: CourseInfo._id})

                CommentInACourse.sort({
                    CreateAt: 'desc'
                }).then(CommentS =>
                    {
                        CommentS = CommentS.map(Comment=>Comment.toObject()) 
                        AssetInfo.sort({
                            CreateAt: 'desc'
                        })
                            .then(AssetInfoS =>{
                                
                                AssetInfoS = AssetInfoS.map(AssetInfo=>AssetInfo.toObject()) 
                                res.render("Course/CourseDetail",
                                            {
                                                AssetInfoS:AssetInfoS,
                                                CommentS: CommentS,
                                                idCourse: idCourse,
                                                Name: CourseInfo.Name,
                                                Description: CourseInfo.Description,
                                                UserName:UserName,
                                                codeCourse: codeCourse
                                            }
                                        );
                            })
                    }
                    
                )}
            
        }
        catch(error){
            console.log(error)  
            //case no comment, case no video for teacher
            const codeCourse = req.params.codeCourse;
            const CurrentUserID = req.cookies.User._id;
            const CurrentUserInfo = await Account.findOne({_id: CurrentUserID});
            const StudentInfo = await Account.findOne({_id: CurrentUserID});
            const CheckStudentAccount = StudentInfo.teacher; //false is student account
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID, codeCourse:codeCourse});
            
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("You have not registered this course yet. Please try again later.");
            }
            let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse});
            let idCourse = CourseInfo._id;
            const UserName = CurrentUserInfo.Realname;  
            res.render("Course/CourseDetail",
                                    {
                                        idCourse: idCourse,
                                        Name: CourseInfo.Name,
                                        Description: CourseInfo.Description,
                                        UserName:UserName,
                                        codeCourse: codeCourse,
                                    }
                                );
        }
       // res.render("Course/CourseDetail", {codeCourse: codeCourse, Name: Name, Description: Description});
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