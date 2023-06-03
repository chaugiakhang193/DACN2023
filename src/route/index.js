const loginRouter = require('./Auth/login');
const signupRouter = require('./Auth/signup');
const forgetRouter = require('./Auth/forget');
const homeRouter = require('./Home/home');
const announcementRouter = require('../route/Annoucement/Annoucement');
const db = require('../../database/db');
const AccountSchema = require('../model/Account');

//connect database
db.connect();


function route(app){
    //  /signup
    app.use("/signup", signupRouter);
    
    //  /login 
    app.use('/login', loginRouter); 
    
    //  /forget
    app.use('/forget', forgetRouter);

    //  /home
    app.use('/home', homeRouter);

    //  /logout
    app.get('/logout', async(req, res) => {
            
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            
            res.redirect('/login');
    });

    /// /announcement
    app.use('/announcement', announcementRouter);


    // DEFAULT PAGE
    app.get('/', (req, res) =>{
        const accessToken =req.cookies.accessToken;
        const refreshToken =req.cookies.refreshToken;
        if(accessToken||refreshToken){
            res.redirect('/home');
        }
        else{
           res.render("defaultpage")
            
        }
    })

}

module.exports = route;