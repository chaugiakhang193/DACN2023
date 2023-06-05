
class Home{

    //[GET] /home
    async RenderHome(req, res) {
        const CheckTeacher =await req.cookies.User.teacher;
        const user_name = await req.cookies.User.name;
        if(CheckTeacher){
            const Teacher = "you are a teacher"
            res.render("home",{user_name: user_name, Teacher: Teacher});
        }
        else{
            const Teacher = "you are a student"
            res.render("home",{user_name: user_name, Teacher: Teacher});
        }

        
        
    }
}
module.exports = new Home;   