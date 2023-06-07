const Annoucement = require("../../model/Annoucement")
const moment = require ("moment")

class AnnoucementController {


    //[GET] /announcement/public/:id
    async RenderAnnoucementPublicDetailPage(req, res) {
        const DetailPage = await Annoucement.findOne({_id: req.params.id});
        const DetailPageStatus = await DetailPage.Public;
        if(!DetailPageStatus){res.send("You need to login for view this page")}
        else{
            //only render detail page when the page is set public 
            this.RenderAnnoucementDetailPage(req, res);
        }
    }

    //[GET] /announcement/:id
    async RenderAnnoucementDetailPage(req, res) {
        const DetailPage = await Annoucement.findOne({_id: req.params.id});
        const Title = DetailPage.Title.toUpperCase();
        const Description = DetailPage.Description;
        const Content  = DetailPage.Content;
        const CreateAt = DetailPage.CreateAt
        res.render("Annoucement/DetailPage",{Title : Title ,Description:Description ,Content:Content, CreateAt:CreateAt} );
    }


    //[GET] /announcement/
    RenderAnnoucement(req, res) {
        Annoucement.find({})
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
        const CreateAt = moment().format('L') + " - " + moment().format('LT');
        const UpdateAt = moment().format('L') + " - " + moment().format('LT');
        
        const data =
        {   Type : req.body.Type,
            Title:req.body.Title,
            Content:req.body.Content,
            Description:req.body.Description,
            CreateAt: CreateAt,
            UpdateAt: UpdateAt,
            Public: req.body.Public
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