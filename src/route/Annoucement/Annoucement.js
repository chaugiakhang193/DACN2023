const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');

const AnnoucementController =require("../../Controller/Annoucement/Annoucement")




// [GET] /announcement/create
router.get('/create',Middleware.VerifyTokenandTeacher ,AnnoucementController.RenderAnnoucementCreate);
// [POST] /announcement/create
router.post('/create',Middleware.VerifyTokenandTeacher,AnnoucementController.PostAnnouncement);

// [GET] /announcement/:id
router.get('/public/:id',AnnoucementController.RenderAnnoucementDetailPage);

// [GET] /announcement/:id
router.get('/:id',Middleware.VerifyToken ,AnnoucementController.RenderAnnoucementDetailPage);

//[GET] /announcement/:id
router.get('/',Middleware.VerifyToken,AnnoucementController.RenderAnnoucement);

module.exports=router;