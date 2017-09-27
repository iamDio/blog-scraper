// Dependencies
const bodyParser = require("body-parser");
const express = require("express");
const hndlbrs = require("express-handlebars");
const logger = require("morgan");
//let mongojs = require('mongojs');
const mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const News = require("./models/News.js");

//require routes file
const routes = require("./routes/index");

mongoose.Promise = Promise;




// Initialize Express
let app = express();
const PORT = process.env.PORT || 4000;

app.engine("handlebars", hndlbrs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//set up morgan and bodyParser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

//make views and public static component

app.use(express.static(__dirname + "/public"));

app.use("/", routes);
// set up mongoose connection

/*let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; */      
 
let MONGODB_URI = 'mongodb://heroku_pxf82bp9:qweasd123@ds147044.mlab.com:47044/';
 

 var uristring = 
  process.env.MONGODB_URI || 
  'mongodb://localhost/articleScraper';

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

let db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose connection error: ", error);
});

//log a succesful message once connection to db is estabilished
//@TODO: fix this line due to deprecation
db.once("open", function() {
	console.log("Mongoose connection succesful");
});

// Listen on port 3000
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));
