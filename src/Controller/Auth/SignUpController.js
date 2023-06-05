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
            {
                name:req.body.name,
                password:hashedPassword,
                email:req.body.email
            }
            
            const name = data.name;
            const ExistName = await AccountSchema.findOne({name});
            //check name already exists
            if(ExistName){
                //res.send("Username have already used")
                res.render("signup", {message: "Username have already used"})
            }
            else{
                const email = data.email;
                const AlreadyMail = await AccountSchema.findOne({email});
                //check mail already exists
                if(AlreadyMail){
                    //res.send("Mail have already used")
                    res.render("signup", {message: "Mail have already used"})
                }
                else{
                    await AccountSchema.insertMany([data])
                    //res.redirect('/login');
                    res.render("signup", {message: "Create account successfully!"})
                }
                }
        }catch(error){
                console.log(error);
            }

    }
}

module.exports = new SignUpController;