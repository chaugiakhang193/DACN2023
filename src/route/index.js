const loginRouter = require('./Auth/login')
const signupRouter = require('./Auth/signup')
const forgetRouter = require('./Auth/forget')
const homeRouter = require('./Home/home')
const db = require('../../database/db')
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



    // DEFAULT PAGE
    app.get('/', (req, res) =>{
        res.render("defaultpage")
    })

}

module.exports = route;