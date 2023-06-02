const jwt = require('jsonwebtoken');
const LoginController = require('../Auth/LoginController')

const Middleware = {

    // verify token, //authorize for student user
    VerifyToken:(req, res,next) => {
        
        
        const accessToken =req.cookies.accessToken;
        const refreshToken =req.cookies.refreshToken;
        const UserInfo = req.cookies.User;
        console.log("Access:" + accessToken);
        console.log("Refresh:" +refreshToken);

        if(refreshToken){    

            //verify refresh token
            jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH,(error,user)=>{
                if(error){
                    res.send("Refresh Token is invalid, need login again");
                }    
                else
                {
                    if(accessToken){
                        //verify access token
                        jwt.verify(accessToken, process.env.JWT_SECRET,async (error,user)=>{
                            if(error){

                                //create new access token
                                
                                const NewAccessToken = await LoginController.generateAccessToken(UserInfo);
                                const accessToken = NewAccessToken;
                                res.cookie("accessToken", NewAccessToken,{
                                    httpOnly: true,
                                    sameSite: "strict",
                                })
                                console.log("Access token after refresh: " + accessToken);


                                //verify new accessToken
                                jwt.verify(accessToken, process.env.JWT_SECRET,(error,user)=>{
                                    if (error){
                                        res.send("New Access Token is invalid, need login again")
                                    }
                                    else
                                    {   //new access token is valid 
                                        req.user = user 
                                        next();
                                    }
                                });
                                
                            }    
                            
                            else{   //accessToken is valid 
                                
                                req.user = user 
                                next();
                            }
                        });
                    }
                    else{
                        //not have accessToken
                        res.send("Access Token is invalid, need login again");
                    }
                }
            });


           
        }
        //not have accessToken and refreshToken 
        else{
            res.send("You're are not authenticated, Please login!!!");
        }
    },

    //authorize for teacher user
    VerifyTokenandTeacher:(req, res, next) => {
        Middleware.VerifyToken(req,res, () =>{
            console.log(req.user.teacher);
            
            if(req.user.teacher){
                
                next();
            }
            else{
                res.send("You are not allowed to do that")
            }
            
        });
        
    }

    
}
module.exports = Middleware;   