const express = require('express');
const router = express.Router();
const Middleware = require('../../Controller/Middleware/MiddlewareController');

const AnnoucementController =require("../../Controller/Annoucement/Annoucement")




// [GET] /announcement/create
router.get('/create',Middleware.VerifyTokenandTeacher ,AnnoucementController.RenderAnnoucementCreate);

// [POST] /announcement/create
router.post('/create',Middleware.VerifyTokenandTeacher,AnnoucementController.PostAnnouncement);

// [GET] /announcement/management
router.get('/management',Middleware.VerifyTokenandTeacher,AnnoucementController.RenderAnnoucementManagement);

// [GET] /announcement/public/:id
router.get('/public/:id',AnnoucementController.RenderAnnoucementPublicDetailPage.bind(AnnoucementController));

// [GET] /announcement/:id/edit
router.get('/:id/edit',Middleware.VerifyTokenandTeacher,AnnoucementController.RenderEditForm);

//[POST] /announcement/:id/edit
router.post('/:id/edit',Middleware.VerifyTokenandTeacher,AnnoucementController.EditAnnouncement);

//[POST] /announcement/:id/delete
router.post('/:id/delete',Middleware.VerifyTokenandTeacher,AnnoucementController.DeleteAnnouncement);

// [GET] /announcement/:id
router.get('/:id',Middleware.VerifyToken ,AnnoucementController.RenderAnnoucementDetailPage);

//[GET] /announcement/
router.get('/',Middleware.VerifyToken,AnnoucementController.RenderAnnoucement);

module.exports=router;