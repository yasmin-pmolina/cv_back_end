const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.js'); 
const regd_users = express.Router();
let users = require('../util').users;


const path = require('path');
const fs = require('fs');
const multer = require('multer'); 





users.push(config.superUser);



const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login, a partir del usuario por defecto 
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 5 });// el tiempo de experacion del token es de 1h 60sx60mintos 
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});





/*
// Add a book review
regd_users.put("/auth/review/:isbn",async  (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;

    const bookDetails = await getDetailbook(isbn)
    if(bookDetails){
        bookDetails["reviews"][username] = review;
        return res.status(200).json(bookDetails);
    }
    
    return res.status(404).json({message: `ISBN ${isbn} not found`});
    
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    const bookDetails = await getDetailbook(isbn)
    if(bookDetails){
       delete bookDetails["reviews"][username];
       return res.status(200).send("Review successfully deleted");
    }
    
    return res.status(404).json({message: `ISBN ${isbn} not found`});
    
});
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.session.authorization.username; 
    const uploadPath = path.join(__dirname,'..', 'models', 'users', user, 'certificates'); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    //const extension = path.extname(file.originalname); // Obtener la extensión del archivo original
    const newFileName = file.originalname; // Nuevo nombre del archivo con ID de sesión y marca de tiempo
    cb(null, newFileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf']; // Extensión permitida
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Only PDF files are allowed'), false); // Rechazar archivo
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

regd_users.post('/auth/upload', upload.array('file', 12), (req, res, next) => {
  const files = req.files;

  try {
    if (!files) {
      const error = new Error('Please choose files');
      error.httpStatusCode = 400;
      return next(error);
    }

    res.send(files);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
