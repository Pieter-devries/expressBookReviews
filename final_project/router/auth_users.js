const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
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

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  } if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            username: username,
            data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
            accessToken,username
  }
   return res.status(200).send("User successfully logged in");
 } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn)
    let username = req.user.username
    books[isbn]["reviews"][username]=req.query.review
    return res.send(books[isbn]["reviews"]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = parseInt(req.params.isbn);
    let username = req.user.username;
    let reviews = books[isbn]["reviews"];
    let filteredReviews = reviews.filter(review => review == username);
    return filteredReviews;
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
