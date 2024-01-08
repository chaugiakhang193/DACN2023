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
                const Start = req.body.Start;
                const End = req.body.End;
                const Name = req.body.Name;
                const codeCourse = req.body.codeCourse;
                const Description = req.body.Description;
                
                var DateStartAt = new Date(Start)
                var DateEndAt = new Date(End)
                //Start Time 
                var DayStart = DateStartAt.getDate();
                var MonthStart = DateStartAt.getMonth() + 1;
                const YearStart = DateStartAt.getFullYear();
                //format Start Time
                if (DayStart < 10) DayStart = '0' + DayStart;
                if (MonthStart < 10) MonthStart = '0' + MonthStart;
                const StartAt = DayStart + "/" + MonthStart + "/" + YearStart;
                console.log(StartAt);

                //End Time
                var DayEnd = DateEndAt.getDate();
                var MonthEnd = DateEndAt.getMonth() + 1;
                const YearEnd = DateEndAt.getFullYear();
                //format End Time
                if (DayEnd < 10) DayEnd = '0' + DayEnd;
                if (MonthEnd < 10) MonthEnd = '0' + MonthEnd;  
                const EndAt = DayEnd + "/" + MonthEnd + "/" + YearEnd;
               
                const Now = Date.now();

            //update schema course for teacher
            await CurrentCourse.updateOne({
                Name: Name,
                codeCourse:codeCourse,
                Description: Description,
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,
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
                StartAt: StartAt,
                DateStartAt: DateStartAt,
                EndAt: EndAt,
                DateEndAt: DateEndAt,
                DateUpdateAt: Now
                }
            )
            res.render("Course/Edit",
            {message: "Thay đổi của bạn đã được lưu"});
           
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
            {message: "Không thể tìm thấy khoá học này"});
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

    // [GET] /course/:codeCourse/member-list
    async RenderMemberList(req,res){
        const codeCourse = req.params.codeCourse;
        const CourseInfo =  await Course.findOne({ IsStudent:false, codeCourse:codeCourse});
        
        const idTeacher = CourseInfo.idTeacher;
        const Teacher = await Account.findOne({_id : idTeacher});
        const nameTeacher = Teacher.Realname;

        const StudentInCourseS = Course.find({IsStudent:true, codeCourse:codeCourse})
        StudentInCourseS.sort({
            DateCreateAt: 'desc'
        })
        .then(StudentInCourseS =>{
            
            StudentInCourseS = StudentInCourseS.map(StudentInCourse=>StudentInCourse.toObject()) 
            res.render("Course/MemberList",{
                codeCourse:CourseInfo.codeCourse,
                Name: CourseInfo.Name,
                Description:CourseInfo.Description,
                nameTeacher: nameTeacher,
                StudentInCourseS: StudentInCourseS
            });
        })
        
    }

    // [GET] /course/:codeCourse/upload-video
    async UploadVideoForm(req,res){
        const codeCourse = req.params.codeCourse;
        const CurrentUserID = req.cookies.User._id;
        const CourseInfo =  await Course.findOne({idTeacher:CurrentUserID, IsStudent:false, codeCourse:codeCourse});
        if(!CourseInfo){
            res.send("Bạn không dạy khoá học này, nên không thể upload video")
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
        res.send("Bài giảng đã được tải lên")
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
            const UserName = StudentInfo.Realname;
            const idAVideo = AVideo._id; 
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID,codeCourse:codeCourse});
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("Bạn chưa đăng ký khoá học này, hãy đăng ký môn học này ở trang ghi danh nhé");
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
                         UserName:UserName
                        });
                })

            
            
        }
        catch(error){
            console.log(error)
            res.send("<h1>Sorry, this video is not avaible. Please try again later</h1>")
        }
    }

    async DeleteVideo(req, res){
        try{
            const DeleteVideoID = req.params.id
            await Asset.deleteOne({_id: DeleteVideoID});
            res.redirect('back')
        }
        catch(error){
            console.log(error);
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
                res.send("Bạn không được xoá bình luận này, vì không thuộc về bạn")
            }
        }
        catch(error)
        {
            res.send("Lỗi, không thể xoá bình luận này")
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
                res.send("Bạn không thể sửa bình luận này")
            }
        }
        catch(error)
        {
            res.send("Bạn không thể sửa bình luận này")
        }
    }

    // [GET] /course/:codeCourse
    async CourseDetail(req, res) {
        try{
            const CheckTeacher =await req.cookies.User.teacher;
            let UpVideo;
            let DeleteVideo;
            if(CheckTeacher){
                UpVideo = "Thêm nội dung bài học"
                DeleteVideo = "Xoá bài giảng này"
            }
            const codeCourse = req.params.codeCourse;
            const CurrentUserID = req.cookies.User._id;
            const StudentInfo = await Account.findOne({_id: CurrentUserID});
            const CheckStudentAccount = StudentInfo.teacher; //false is student account
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID, codeCourse:codeCourse});
            
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("Bạn chưa đăng ký khoá học này, hãy đăng ký môn học này ở trang ghi danh nhé ");
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
                                console.log(UpVideo + DeleteVideo)
                                res.render("Course/CourseDetail",
                                            {
                                                AssetInfoS:AssetInfoS,
                                                CommentS: CommentS,
                                                idCourse: idCourse,
                                                Name: CourseInfo.Name,
                                                Description: CourseInfo.Description,
                                                UserName:UserName,
                                                codeCourse: codeCourse,
                                                UpVideo: UpVideo,
                                                DeleteVideo:DeleteVideo
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
                    res.send("Bạn chưa đăng ký khoá học này, hãy đăng ký môn học này ở trang ghi danh nhé");}

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
                                console.log(UpVideo + DeleteVideo)
                                res.render("Course/CourseDetail",
                                            {
                                                AssetInfoS:AssetInfoS,
                                                CommentS: CommentS,
                                                idCourse: idCourse,
                                                Name: CourseInfo.Name,
                                                Description: CourseInfo.Description,
                                                UserName:UserName,
                                                codeCourse: codeCourse,
                                                UpVideo:UpVideo,
                                                DeleteVideo:DeleteVideo
                                            }
                                        );
                            })
                    }
                    
                )}
            
        }
        catch(error){
            console.log(error)  
            //case no comment, case no video for teacher
            const CheckTeacher =await req.cookies.User.teacher;
            let UpVideo;
            let DeleteVideo;
            if(CheckTeacher){
                UpVideo = "Thêm nội dung bài học"
                DeleteVideo = "Xoá bài giảng này"
            }
            const codeCourse = req.params.codeCourse;
            const CurrentUserID = req.cookies.User._id;
            const CurrentUserInfo = await Account.findOne({_id: CurrentUserID});
            const StudentInfo = await Account.findOne({_id: CurrentUserID});
            const CheckStudentAccount = StudentInfo.teacher; //false is student account
            const StudentAlreadyRegisterThisCourseYet = await Course.findOne({idStudent:CurrentUserID, codeCourse:codeCourse});
            
            if(!CheckStudentAccount && !StudentAlreadyRegisterThisCourseYet){
                res.send("Bạn chưa đăng ký khoá học này, hãy đăng ký môn học này ở trang ghi danh nhé");
            }
            let CourseInfo =  await Course.findOne({IsStudent:false, codeCourse:codeCourse});
            let idCourse = CourseInfo._id;
            const UserName = CurrentUserInfo.Realname;  
            console.log(UpVideo + DeleteVideo)
            res.render("Course/CourseDetail",
                                    {
                                        idCourse: idCourse,
                                        Name: CourseInfo.Name,
                                        Description: CourseInfo.Description,
                                        UserName:UserName,
                                        codeCourse: codeCourse,
                                        UpVideo: UpVideo,
                                        DeleteVideo: DeleteVideo
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
        const Start = req.body.Start;
        const End = req.body.End;
        var DateStartAt = new Date(Start)
        var DateEndAt = new Date(End)

        const Name = req.body.Name;
        const codeCourse = req.body.codeCourse;
        const Description = req.body.Description;
        const idAuthor = req.cookies.User._id;
        const Teacher = await Account.findOne({_id : idAuthor});
        const nameTeacher = Teacher.Realname;
        const nameAuthor = nameTeacher;
        
        //Start Time 
        var DayStart = DateStartAt.getDate();
        var MonthStart = DateStartAt.getMonth() + 1;
        const YearStart = DateStartAt.getFullYear();
        //format Start Time
        if (DayStart < 10) DayStart = '0' + DayStart;
        if (MonthStart < 10) MonthStart = '0' + MonthStart;
        const StartAt = DayStart + "/" + MonthStart + "/" + YearStart;
        console.log(StartAt);

        //End Time
        var DayEnd = DateEndAt.getDate();
        var MonthEnd = DateEndAt.getMonth() + 1;
        const YearEnd = DateEndAt.getFullYear();
        //format End Time
        if (DayEnd < 10) DayEnd = '0' + DayEnd;
        if (MonthEnd < 10) MonthEnd = '0' + MonthEnd;  
        const EndAt = DayEnd + "/" + MonthEnd + "/" + YearEnd;

            const data =
            {   
                Name: Name,
                codeCourse:codeCourse,
                Description: Description,
                idAuthor: idAuthor,
                idTeacher: idAuthor,
                StartAt: StartAt,
                DateStartAt: Start,
                EndAt: EndAt,
                DateEndAt: End,
                nameTeacher: nameTeacher,
                nameAuthor: nameAuthor,
            } 
            await Course.insertMany([data]);
            res.render("Course/CreateCourse",{message: "Tạo khoá học thành công"});
        }catch(error){
            res.render("Course/CreateCourse",{message: "Không thể tạo khoá học"});
        }
    }
    


    //[GET] /course/management  
    ListManagement(req, res) {
        res.render("Course/ListManagement")
    }
}

module.exports = new CourseController;