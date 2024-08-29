const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/users");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456qq789',
  database: 'upload',
});

router.get(["/", "/login"], (req, res) => {
  //res.send("<h1>Hello Tutor Joes Salem</h1>");
  
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/home", userContoller.isLoggedIn, (req, res) => {
  //console.log(req.name);
  
  if (req.user) {
    res.render("home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/reports", userContoller.isLoggedIn, (req, res) => {
  if (req.user) {
    // Query the database for all rows in the `reports` table
    connection.query("SELECT * FROM reports", (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error fetching reports");
      }

      // Pass the results to the view
      res.render("reports", { user: req.user, reports: results });
    });
  } else {
    res.redirect("/login");
  }
});



module.exports = router;