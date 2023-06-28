const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  username = req.body.username;
  password = req.body.password;
  if (username && password) {
    
  } else {
      return res.status(401).json({message: "Both username and password must be sent"});
  }
  if (isValid(username)) {
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(208).json({message: "Already registered username, choose another"});
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        console.log("Starting Book List Request");
        const booklist = JSON.stringify(books,null,4);
        resolve(res.send(booklist));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    new Promise((resolve,reject) => {
        console.log("Starting ISBN Request");
        let isbn = parseInt(req.params.isbn);
        resolve(res.send(books[isbn]));
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve,reject) => {
        let author = req.params.author
        Object.keys(books).forEach(key => {
            let details = books[key];
            if (details["author"] === author) {
                resolve(res.send(details))
            }
    })
})});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve,reject) => {
        let title = req.params.title
    Object.keys(books).forEach(key => {
        let details = books[key];
        if (details["title"] === title) {
            resolve(res.send(details))
        }
    })
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn)
    return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
