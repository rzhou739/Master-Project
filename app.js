// chatgpt3.5
const express = require("express");
const mysql = require("mysql2");
const doenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const multer = require('multer');
const cookieParser = require("cookie-parser");
//const fs = require("fs");
const app = express();

//Combine the search_System in the login_system
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static('public'));


app.get("/download/:filename", (req, res) => {
  const fileName = decodeURIComponent(req.params.filename);
  const reportPath = path.join("/Users/ruizhou/Public/upload", fileName);
  res.download(reportPath, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

app.post("/search", (req, res) => {
  const { author, title, year, keywords } = req.body;
  let query = "SELECT * FROM reports WHERE 1=1";

  if (author) {
    query += ` AND author LIKE '%${author}%'`;
  }
  if (title) {
    query += ` AND title LIKE '%${title}%'`;
  }
  if (year) {
    query += ` AND year = ${year}`;
  }
  if (keywords) {
    query += ` AND keywords LIKE '%${keywords}%'`;
  }

  connection.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});


hbs.registerHelper('encodeURIComponent', function(value) {
  return encodeURIComponent(value);
});

doenv.config({
  path: "./.env",
});
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});
// Connection to the 'login' database
// const db = mysql.createConnection({
//   host: process.env.DATABASE_HOST || '127.0.0.1',
//   user: process.env.DATABASE_USER || 'root',
//   password: process.env.DATABASE_PASS || '123456qq789',
//   database: process.env.DATABASE || 'login',
//   port: 3306
// });


db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connection Success");
  }
});
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine", "hbs");

//set some login limits

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath);

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get("/reports",(req, res) => {
  connection.query("SELECT * FROM reports", (err, rows) => {
    if (err) {
      console.error("Error fetching reports:", err);
      res.status(500).send("Error fetching reports");
    } else {
      res.render("reports", { reports: rows });
    }
  });
});

app.get("/reports/edit/:author", (req, res) => {
  const author = req.params.author;
  connection.query("SELECT * FROM reports WHERE author = ?", [author], (err, rows) => {
    if (err) {
      console.error("Error fetching report:", err);
      res.status(500).send("Error fetching report");
    } else {
      if (rows.length > 0) {
        res.render("edit", { report: rows[0] });
      } else {
        res.status(404).send("Report not found");
      }
    }
  });
});

// Route for updating the report in the database
app.post('/reports/edit/:author', (req, res) => {
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // Retrieve the updated report from the request body
  const report = req.body;

  // Update the report in the database
  connection.query(`UPDATE reports SET ? WHERE author = '${author}'`, report, (err) => {
    if (err) {
      return res.send(err);
    }

    // Redirect the user back to the reports page
    res.redirect('/reports');
  });
});


const fs = require("fs");
//const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456qq789',
  database: 'upload',
  port:3306
});
// const mysqlConnection = mysql.createConnection({
//   host: process.env.UPLOAD_DB_HOST || '127.0.0.1',
//   user: process.env.UPLOAD_DB_USER || 'root',
//   password: process.env.UPLOAD_DB_PASSWORD || '123456qq789',
//   database: process.env.UPLOAD_DB_NAME || 'upload',
//   port: 3306
// });

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL successfully");
});

app.post("/reports/delete/:author", async (req, res) => {
  const author = req.params.author;
  const filePath = path.resolve("/Users/ruizhou/Public/upload", author + ".pdf");

  console.log("Constructed file path:", filePath);

  try {
    await fs.promises.access(filePath);
    console.log("File exists. Deleting...");

    await fs.promises.unlink(filePath);
    console.log("File deleted successfully");

    // DELETE the record from the MySQL table
    const deleteQuery = "DELETE FROM reports WHERE author = ?";
    mysqlConnection.query(deleteQuery, [author], (err, result) => {
      if (err) {
        console.error("Error deleting MySQL record:", err);
        res.status(500).send("Error deleting MySQL record");
      } else {
        console.log("MySQL record deleted successfully");
        res.redirect("/reports");
      }
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("File does not exist or there was an error deleting the file");
  }
});



app.listen(5000, () => {
  console.log("Server Started @ Port 5000");
});

// Define a storage strategy for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/ruizhou/Public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize the multer middleware with the storage strategy
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  const filePath = path.resolve("/Users/ruizhou/Public/upload", req.file.filename);
  console.log('File uploaded to:', filePath);
  console.log("Upload folder path:", "/Users/ruizhou/Public/upload");
  // rest of the code

  
 
  // Get the form data
    const author = req.body.author;
    const file_title = req.body.file_title;
    const year = req.body.year;
    const keywords = req.body.keywords;
    //onst file_id = req.body.file_id;

    
    // Insert the data into the MySQL database
    const query = 'INSERT INTO reports (author, file_title, year, keywords, file_path) VALUES (?, ?, ?, ?, ?)';
    const values = [author, file_title, year, keywords, filePath];
  

  connection.query(query, values, (err, result) => {
    
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('An error occurred while submitting the report data');
      return;
    }
    // Send a success response
    res.send('Report data inserted successfully');
  });

});







  


















