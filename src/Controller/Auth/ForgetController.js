const AccountSchema = require('../../model/Account');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const bcrypt= require('bcrypt');

class ForgetController{

    //[GET] /login  
    RenderForget(req, res) {
        res.render("forget");
    }

    //[POST] /login
    async ForgotPassword(req, res) {
       try{
          const email=req.body.email
          const userData = await AccountSchema.findOne({email: email});
          if(userData){
            
            const randomString = randomstring.generate();
            const UpdatedToken = await AccountSchema.updateOne({email:email}, {$set:{token:randomString}});
            this.sendResetPasswordMail(userData.Realname, userData.email, randomString);
            //res.send("Please check your email")
            //res.render('forget', {message: "Please check your email"})
            //res.send("Please check your email") 
            res.render('forget', {message: "Mail hỗ trợ đổi mật khẩu đã được gửi"})

          }
          else{
            
            res.render('forget', {message: "Không thể tìm thấy Mail của bạn"})

          }
       }
       catch(error){
          console.log(error);  
          res.send("oh,some thing went wrong :(")
          //res.render("forgot")
       }
    }


    
    sendResetPasswordMail = async(name, email, token)=>{

        try{
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port:587,
                secure: false,
                requireTLS: true,
                auth:{
                    user:process.env.Email,
                    pass:process.env.EmailPassword
                }
            });  

            const mailOptions = {
                from:process.env.Email,
                to:email,
                subject:'Mail hỗ trợ đổi mật khẩu',
                html: '<p> Xin Chào '+name+', hãy nhấp vào <a href ="http://127.0.0.1:3000/forget/reset-password?token='+token+ '">đường link này và tạo mật khẩu mới nhé!</a>' 
            }

            await transporter.sendMail(mailOptions, function(error,infor){
                if(error){
                    console.log(error);
                }   
                else{
                    
                    console.log("Mail has been sent: - "+ infor.response)
                    
                }
            });
        }
        catch(error)
        {
            res.send("Một lỗi đã khiến mail không được gửi đi")
        }
    }


    //res.render("reset-password");
    //[GET] /forget/reset-password
    async RenderResetPassword(req, res) {
        try{
            const token = req.query.token
            const tokenData = await AccountSchema.findOne({token:token})
            if(tokenData){
                res.render('reset-password', { user_id:tokenData._id})
                
            }
            else{
                res.send("Xin lỗi, link này của bạn đã hết hạn")
            }
        }catch(error){
            res.send("Oh, some thing went wrong")
        }
    }

    //[POST] /forget/reset-password
    async ResetPassword(req, res) {
        try{
            const password = req.body.password;

            //hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const user_id = req.body.user_id;
            console.log(user_id)
            const UpdatedPassword = await AccountSchema.findByIdAndUpdate({_id: user_id},{$set: {password: hashedPassword, token:''}})
            res.redirect('/')
        }   
        catch(error){
            console.log(error.message)
        }
    
    }

}
module.exports = new ForgetController;