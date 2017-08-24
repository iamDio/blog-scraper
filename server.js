// Dependencies
let bodyParser=require ("body-parser");
let express =require('express');
let hndlbrs =require('express-handlebars');
let logger = require('morgan');
//let mongojs = require('mongojs');
let mongoose=require('mongoose');

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var News = require("./models/News.js");

// Require request and cheerio. This makes the scraping possible
let request= require('request');
let cheerio= require('cheerio');


// Initialize Express
let app = express();
const PORT = process.env.port || 3000;

mongoose.Promise = Promise;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//set up morgan and bodyParser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

//make views a static component
app.use(express.static('views'));

// set up mongoose connection
mongoose.connect('mongodb://localhost/articleScraper');
let db = mongoose.connection;

db.on('error', function(error){
	console.log('Mongoose connection error: ', error);
});

//log a succesful message once connection to db is estabilished
db.once('open', function(){
	console.log('Mongoose connection succesful');
});

// Main route (simple Hello World Message)
app.get('/', function(req,res){
	res.send('Hello World')
});


//write a function that hcecks for errors
//@TODO: rewrite this code using async/await for better error handling


app.get('/scrape', function(req,res){
	request('http://www.cnn.com/', function(error, response, html) {
		let $ = cheerio.load(html);
		$('article h3').each(function(i, element) {

			let result = {};
			result.title = $(this).children('a').text();
			result.link =  $(this).children('a').attr('href');
			console.log(result)
		let entry = new News(result);

			entry.save(function(err,doc){
				if(err) {
					console.log(err);
				}else{
					console.log(doc);
				}
			})
		})
	})
	res.send('scrape complete');
})

//retrieves from the db all of the articles scraped 
app.get('/articles', function(req, res){
	News.find({}, function(error,doc){
		if(error) {
			console.log(error);
		}else{
			res.json(doc);
		}
	});
});

//retrieves from the db a specific article
app.get('/articles/:id', function(req,res){
	News.findOne({_id: req.params.id})
		.populate('')
		.exec(function(error,doc) {
		if(error) {
			console.log(error);
		}else{
			res.json(doc);
			}
		});
});



// Listen on port 3000
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));

