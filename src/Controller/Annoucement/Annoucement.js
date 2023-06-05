const Annoucement = require("../../model/Annoucement")


class AnnoucementController {

     //[GET] /announcement/c
    RenderAnnoucement(req, res) {
        res.render("Annoucement/Annoucement");
    }

    //[GET] /announcement/create
    RenderAnnoucementCreate(req, res) {
        res.render("Annoucement/AnnoucementCreate");
    }

    //[POST] /announcement/create
    async PostAnnouncement(req, res) {
        try{
        const data =
        {
            Title:req.body.Title,
            Content:req.body.Content,
            Description:req.body.Description
        } 
        await Annoucement.insertMany([data]);
        res.render("Annoucement/AnnoucementCreate",{message: "You have successfully posted annoucement!"} );}
        catch(error)
        {
        res.render("Annoucement/AnnoucementCreate",{message: "You have failed posted annoucement!"} )
        }
    }
    
}

module.exports = new AnnoucementController;