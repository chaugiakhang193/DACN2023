const Annoucement = require("../../model/Annoucement")
class Home{

    //[GET] /home
    async RenderHome(req, res) {
        const CheckTeacher =await req.cookies.User.teacher;
        const Realname = await req.cookies.User.Realname;

        let AnnoucementQuery = Annoucement.find({}).sort({ DateUpdateAt: -1 }).limit(10)
        AnnoucementQuery.sort({
            DateCreateAt: 'desc'
        })
        .then(AnnoucementInfoS =>{
            AnnoucementInfoS = AnnoucementInfoS.map(AnnoucementInfo=>AnnoucementInfo.toObject()) 
            if(CheckTeacher){
                const Teacher = "you are a teacher"
                res.render("home",{Realname: Realname, Teacher: Teacher, AnnoucementInfoS:AnnoucementInfoS});
            }
            else{
                const Teacher = "you are a student"
                res.render("home",{Realname: Realname, Teacher: Teacher, AnnoucementInfoS:AnnoucementInfoS});
            }
        })
       
        
        
    }
}
module.exports = new Home;   