const express = require('express');
const app = express();
const port = 3000;
const path =require('path')
const hbs = require('express-handlebars');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const mongoose = require('mongoose');
const templatePath = path.join(__dirname, 'resources/views');
const route = require('./route');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
app.engine("hbs", hbs.engine());
app.set("view engine","hbs");
app.set("views", templatePath);
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(morgan("common"));
app.use(cookieParser());


//init route 
dotenv.config();
route(app);


app.listen(port, () =>{console.log("Start server listening on port " + port)});