
class Home{

    //[GET] /home
    async RenderHome(req, res) {
        const CheckTeacher =await req.cookies.User.teacher;
        const Realname = await req.cookies.User.Realname;
        if(CheckTeacher){
            const Teacher = "you are a teacher"
            res.render("home",{Realname: Realname, Teacher: Teacher});
        }
        else{
            const Teacher = "you are a student"
            res.render("home",{Realname: Realname, Teacher: Teacher});
        }

        
        
    }
}
module.exports = new Home;   