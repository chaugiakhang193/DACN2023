const jwt = require('jsonwebtoken');

const Middleware = {

    // verify token, //authorize for student user
    VerifyToken:(req, res,next) => {
        
        //const token = req.header.token;
        const token =req.cookies.accessToken;
        
        if(token){
            //const accessToken = token.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET,(error,user)=>{
                if(error){
                    res.send("Token is invalid, need login again");
                }    
                else
                {
                    req.user = user
                    next();
                }
            });   
        }
        else{
            res.send("You're are not authenticated");
        }
    },

    //authorize for teacher user
    VerifyTokenandTeacher:(req, res, next) => {
        Middleware.VerifyToken(req,res, () =>{
            console.log(req.user.teacher);
            //req.user.id == req.params.id || 
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