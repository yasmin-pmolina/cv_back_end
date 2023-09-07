const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config.js'); 
const regd_users = express.Router();

let users = [];
users.push(config.superUser);

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


module.exports.authenticated = regd_users;
module.exports.users = users;
