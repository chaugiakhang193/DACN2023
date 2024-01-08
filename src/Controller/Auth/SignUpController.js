const AccountSchema = require('../../model/Account');
const bcrypt = require('bcrypt');

class SignUpController {

    //[GET] /signup
    RenderSignUp(req, res) {
        res.render("signup");
    }

     //[POST] /signup
    async Register(req, res) {
       
        try{
            //hashed password for secure    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const data =
            {   teacher: req.body.teacher,
                name:req.body.name,
                password:hashedPassword,
                email:req.body.email,
                MSSV: req.body.name,
                Realname: req.body.Realname,
                
            }
            var message = " ";
            const name = data.name;
            const ExistName = await AccountSchema.findOne({name});
            //check name already exists
            if(ExistName){
                //res.send("Username have already used")
                message = await message  + "Username đã có người dùng"
                res.render("signup", {message: message})
            }
            else{
                const email = data.email;
                const AlreadyMail = await AccountSchema.findOne({email});
                //check mail already exists
                if(AlreadyMail){
                    //res.send("Mail have already used")
                    message =await  message  + "Email này đã có người dùng"
                    res.render("signup", {message: message})
                }
                else{
                    const name = await req.body.name.length;
                    if(name < 8){   
                        message = await message  +  "Tên tài khoản cần là MSSV 8 ký tự "
                        res.render("signup", {message: message })}
                    else{
                        const password = await req.body.password.length;
                        if(password <8){ 
                                message = await message  +  "Mật khẩu phải là 8-16 chữ số/ký tự "
                                res.render("signup", {message: message })}
                        else{
                            await AccountSchema.insertMany([data])
                            //res.redirect('/login');
                            res.render("signup", {message: "Đã tạo tài khoản thành công!"})
                            }
                        }
                    }
                }
        }catch(error){console.log(error);}

    }
}

module.exports = new SignUpController;