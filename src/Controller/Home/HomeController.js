
class Home{

    //[GET] /home
    RenderHome(req, res) {
        res.render("home");
    }
}
module.exports = new Home;   