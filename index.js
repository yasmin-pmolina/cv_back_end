const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const authenticated = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const config = require('./config.js'); 

const app = express();

app.use(express.json());

app.use("/applicant",session({secret:"fingerprint_applicant",resave: true, saveUninitialized: true}))

app.use("/applicant/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});
 
app.use("/applicant", authenticated);
app.use("/", genl_routes);


app.listen(config.port,()=>console.log("***Server is running***"));
