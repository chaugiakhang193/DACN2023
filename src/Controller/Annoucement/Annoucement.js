const Annoucement = require("../../model/Annoucement")
const Account = require("../../model/Account")
const moment = require ("moment")

class AnnoucementController {

    async DeleteAnnouncement (req,res){
        try{
            
            const DetailPage = await Annoucement.findOne({_id: req.params.id});
            
            await DetailPage.deleteOne({_id: req.params.id});
            res.redirect('back')
        }
        catch(error){
            console.log(error);
            res.send("<h1>Page not found on the server</h1>")
        }
    }

    async EditAnnouncement (req,res){
        try{
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; 
            let dd = today.getDate();
                
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
                
            const formattedToday = await dd + '/' + mm + '/' + yyyy;   
            const DetailPage = await Annoucement.findOne({_id: req.params.id});
            const Title = req.body.Title;
            const Description = req.body.Description;
            const Content  = req.body.Content
            const UpdateAt = formattedToday + " - " + moment().format('LT');
            const DateUpdateAt = new Date();
            await DetailPage.updateOne({
                Title:Title,
                Description: Description,
                Content: Content,
                UpdateAt: UpdateAt,
                DateUpdateAt: DateUpdateAt
            })
            res.redirect("/announcement/management")
        }
        catch(error){
            console.log(error);
            res.send("<h1>Page not found on the server</h1>")
        }
    }

    // [GET] /announcement/:id/edit
    async RenderEditForm(req,res){
        try{
        const DetailPage = await Annoucement.findOne({_id: req.params.id});
        const Title = DetailPage.Title;
        const Description = DetailPage.Description;
        const Content  = DetailPage.Content;
        const id = req.params.id
        res.render("Annoucement/AnnoucementEdit", {Title: Title, Description: Description, Content: Content, id:id})
        }
        catch (err) {
            res.send("<h1>Page not found on the server</h1>")
        }
    }


    //[GET] /announcement/management
    async RenderAnnoucementManagement(req,res){
        let AnnoucementQuery = Annoucement.find({})
        
        AnnoucementQuery.sort({
            DateUpdateAt: 'desc'
        })
        .then(AnnoucementInfoS =>{
            AnnoucementInfoS = AnnoucementInfoS.map(AnnoucementInfo=>AnnoucementInfo.toObject()) 
            res.render("Annoucement/AnnoucementManagement", {AnnoucementInfoS});
        })
    }

    //[GET] /announcement/public/:id
    async RenderAnnoucementPublicDetailPage(req, res) {
        try{
            const DetailPage = await Annoucement.findOne({_id: req.params.id});
            const DetailPageStatus = await DetailPage.Public;
            if(!DetailPageStatus){res.send("You need to login for view this page")}
            else{
                //only render detail page when the page is set public 
                this.RenderAnnoucementDetailPage(req, res);
            }
        }
        catch(error)
        {res.send("<h1>Page not found on the server</h1>")}
    }

    //[GET] /announcement/:id
    async RenderAnnoucementDetailPage(req, res) {
        try{
            const DetailPage = await Annoucement.findOne({_id: req.params.id});
            const Title = DetailPage.Title.toUpperCase();
            const Description = DetailPage.Description;
            const Content  = DetailPage.Content;
            const CreateAt = DetailPage.CreateAt;
            let AuthorName
            try{
                const Author= await Account.findOne({_id: DetailPage.Author});
                AuthorName  = await Author.Realname
                res.render("Annoucement/DetailPage",
                    {Title : Title ,Description:Description ,Content:Content, CreateAt:CreateAt, Author: AuthorName} );
            }
            catch(error){
                AuthorName = await "Unknown";
                res.render("Annoucement/DetailPage",
                    {Title : Title ,Description:Description ,Content:Content, CreateAt:CreateAt, Author: AuthorName} );
            }
        }
        catch(error)
        {
            res.send("<h1>Page not found on the server</h1>")
        }
    }


    //[GET] /announcement/
    RenderAnnoucement(req, res) {
        let AnnoucementQuery = Annoucement.find({})
        
        AnnoucementQuery.sort({
            DateCreateAt: 'desc'
        })
        .then(AnnoucementInfoS =>{
            AnnoucementInfoS = AnnoucementInfoS.map(AnnoucementInfo=>AnnoucementInfo.toObject()) 
            res.render("Annoucement/Annoucement", {AnnoucementInfoS});
        })
        
        
    }

    //[GET] /announcement/create
    RenderAnnoucementCreate(req, res) {
        res.render("Annoucement/AnnoucementCreate");
    }


    //[POST] /announcement/create
    async PostAnnouncement(req, res) {
        try{
        //format date data to dd/mm/yyyy
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; 
        let dd = today.getDate();
            
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
            
        const formattedToday = dd + '/' + mm + '/' + yyyy;   

        const CreateAt = formattedToday + " - " + moment().format('LT');
        const UpdateAt = formattedToday + " - " + moment().format('LT');
        
        const data =
        {   Type : req.body.Type,
            Title:req.body.Title,
            Content:req.body.Content,
            Description:req.body.Description,
            CreateAt: CreateAt,
            UpdateAt: UpdateAt,
            Public: req.body.Public,
            Author: req.cookies.User._id,   
        } 
        await Annoucement.insertMany([data]);
        res.render("Annoucement/AnnoucementCreate",{message: "You have successfully posted annoucement!"} );}
        catch(error)
        {
        console.log(error);
        res.render("Annoucement/AnnoucementCreate",{message: "You have failed posted annoucement!"} )
        }
    }
    
}

module.exports = new AnnoucementController;