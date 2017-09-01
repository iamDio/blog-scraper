// Dependencies
const bodyParser=require ("body-parser");
const express =require('express');
const hndlbrs =require('express-handlebars');
const logger = require('morgan');
//let mongojs = require('mongojs');
const mongoose=require('mongoose');
// Require request and cheerio. This makes the scraping possible
const request= require('request');
const cheerio= require('cheerio');
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const News = require("./models/News.js");


mongoose.Promise = Promise;

// Initialize Express
let app = express();
const PORT = process.env.port || 3000;

app.engine("handlebars", hndlbrs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

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
//@TODO: fix this line due to deprecation
db.once('open', function(){
	console.log('Mongoose connection succesful');
});


// Main route, should render index.handlebars
app.get('/', function(req,res){
	res.render('index')
});

//write a function that checks for errors
//@TODO: rewrite this code using async/await and/or promises

app.get('/scrape', function(req,res){
	request('https://medium.com/', function(error, response, html) {
		  if (!error && response.statusCode == 200) {
		    let $ = cheerio.load(html);
		    
		 $('h3.u-contentSansBold').each(function(i, element){
		//$('article.h3').each(function(i, element) {



			let result = {};
			result.title = $(this).text();
			result.text = $(this).parent('a').text();
			result.link = $(this).parent('a').attr('href');

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
		  }

	res.send('scrape complete');
	})

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

