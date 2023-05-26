const AccountSchema = require('../../model/Account');
const bcrypt = require('bcrypt');

class LoginController{

    //[GET] /login 
    RenderLogin(req, res) {
        res.render("login");
    }

    //[POST] /login
    async Authentication(req, res){
        try{
            const User = await AccountSchema.findOne({name:req.body.name})
            if(!User){
                res.send("Can't find your account, please try again");
            }else{
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    User.password
                );
                if(!validPassword){
                    res.send("Your password is incorrect, please try again");

                }
                else{
                    res.redirect('/home');
                }

            }


        }
        catch{
            res.send("Oh, some thing went wrong");
        }
    }
    

}
module.exports = new LoginController;   