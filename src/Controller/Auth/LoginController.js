const AccountSchema = require('../../model/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                    const accessToken =  this.generateAccessToken(User)
                    const refreshToken = this.generateRefreshToken(User)
                    
                    res.cookie("accessToken", accessToken,{
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                    })
                    res.cookie("refreshToken", refreshToken,{
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                    })
                    res.cookie("User",User,{
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                    })
                    res.redirect('/home');
                }

            }


        }
        catch(error){
            res.send("Oh, some thing went wrong");
            console.log(error)
        }
    }
    

    generateAccessToken=(User)=>{
        return jwt.sign(
            {
                id: User.id,
                teacher: User.teacher,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m"
            }
        );
    }

    generateRefreshToken=(User)=>{
        return jwt.sign(
            {
                id: User.id,
                teacher: User.teacher,
            },
            process.env.JWT_SECRET_REFRESH,
            {
                expiresIn: "24h"
            }
        );
    }
}
module.exports = new LoginController;   