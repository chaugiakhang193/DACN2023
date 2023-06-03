const Annoucement = require("../../model/Annoucement")


class AnnoucementController {

    //[GET] /announcement/create
    RenderAnnoucement(req, res) {
        res.render("Annoucement/Annoucement");
    }

    async PostAnnouncement(req, res) {
        const data =
        {
            Title:req.body.Title,
            Content:req.body.Content,
            Description:req.body.Description
        } 
        await Annoucement.insertMany([data]);
        res.redirect('/announcement/create');
    }
    
}

module.exports = new AnnoucementController;