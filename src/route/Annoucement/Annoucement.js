const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');

const AnnoucementController =require("../../Controller/Annoucement/Annoucement")

// [GET] /announcement/create
router.get('/create',Middleware.VerifyTokenandTeacher ,AnnoucementController.RenderAnnoucement);
// [POST] /announcement/create
router.post('/create',Middleware.VerifyTokenandTeacher,AnnoucementController.PostAnnouncement);

module.exports=router;