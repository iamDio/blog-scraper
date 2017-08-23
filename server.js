// Dependencies
let bodyParser=require ("body-parser");
let express =require('express');
let hndlbrs =require('express-handlebars');
let logger = require('morgan');
//let mongojs = require('mongojs');
let mongoose=require('mongoose');

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Require request and cheerio. This makes the scraping possible
let request= require('request');
let cheerio= require('cheerio');

mongoose.Promise = Promise;

// Initialize Express
let app = express();
const PORT = process.env.port || 3000;


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
function errorCheck(error,res,doc) {
	if(error){
		res.send(doc);
	}else{
		res.json(doc);
	}
}

app.get('/scrape', function(req,res){
	request('http://www.cnn.com/', function(error, response, html) {
		let $ = cheerio.load(html);
		$('article h3').each(function(i, element) {
			let result = {};
			result.title = $(this).children('a').text();
			result.link =  $(this).childre('a').attr('href');

		let entry = new Article(result);

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

app.get('/articles', function(req, res){
	Article.find({}, function(error,doc){
		errorCheck(error,res,doc);
	});
});

app.get('/articles/:id', function(req,res){
	Article.findOne({_id: req.params.id})
		.populate('')
		.exec((error,doc)=>{
		errorCheck(error,res,doc);

		})
});



// Listen on port 3000
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));

