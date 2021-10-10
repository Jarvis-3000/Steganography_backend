const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//import routes
const userRoutes = require("./api/routes/user");


mongoose.connect(process.env.MONGO_URI,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);
 
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use("/user",userRoutes);


app.use((req,res,next)=>{
    const error =new Error('Page Not Found !');
    error.status=404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app; 