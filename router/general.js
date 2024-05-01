const express = require('express');
const axios = require("axios");
//let users = require("./auth_users.js").users;
const public_users = express.Router();
const config = require('../config.js'); 
const readJsonFile = require('../util').readJsonFile;
const uploadPdf = require('../util').uploadPdf;
const uploadFilePdf = require('../util').uploadFilePdf;
const sendFilePdf = require('../util').sendFilePdf;
const path = require('path');
const fs = require('fs');
const multer = require('multer'); 

let users = require('../util').users;


const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid


  }
  
  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

// get info of applicant '/' 
public_users.get('/contact', async function (req, res) {

  let rutaAbsoluta = '';
  const { language, applicant } = req.query;
  
  try {

    if (!language || !applicant) {
      return res.status(400).json({ error: 'missing information required for consultation'});
    }
    
    let rutaRelativa = `..\\models\\users\\${applicant}\\${language}\\userData.json`;
    rutaAbsoluta = path.resolve(__dirname, rutaRelativa);
    const details = await readJsonFile(rutaAbsoluta.replace(/\\/g, "/"));

    if(details){
      return res.status(200).json(details);
    }
  
    return res.status(404).json({message: `applicant information (${rutaAbsoluta}) not found`});
} catch (error) {

  return res.status(404).json({message: error.message, url: rutaAbsoluta});
}
   
});  

// get certificate of applicant
public_users.get('/download/:certificate', (req, res) => {

  certificate = req.params.certificate;
  const { applicant } = req.query;
  let rutaAbsoluta = '';

  try {
  // Obtén el nombre del archivo PDF desde la consulta (query parameter)
  if (!applicant) {      
    return res.status(400).json({ error: 'missing information required for consultation'});
  }
    
  let rutaRelativa = `../models/users/${applicant}/certificates/${certificate}.pdf`;
  rutaAbsoluta = path.resolve(__dirname, rutaRelativa);

  sendFilePdf(res, rutaAbsoluta, certificate)
  // Lee el archivo PDF y envíalo como respuesta

} catch (error) {

  return res.status(404).json({message: error.message, url: rutaAbsoluta});
}

});

// registrar applicant
// TODO: agregar validacion de directorio y archivo json 
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


module.exports.general = public_users;
