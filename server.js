// Dependencies
let bodyParser=require ("body-parser");
let express =require('express');
let hndlbrs =require('express-handlebars');
let mongoose=require('mongoose');
let mongojs = require('mongojs');

// Require request and cheerio. This makes the scraping possible
let request= require('request');
let cheerio= require('cheerio');

// Initialize Express
let app = express();
const PORT = process.env.port || 3000;

// Database configuration
let databaseUrl = 'articleScraper';
let collections = ['scrapedData'];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections)
db.on('error', function (err) {
    console.log('database error', err)
});

// Main route (simple Hello World Message)
app.get('/', function(req,res){
	res.send("Hello World")
});

// Retrieve data from the db
	  // Find all results from the scrapedData collection in the db
		    // Throw any errors to the console
		    // If there are no errors, send the data to the browser as json


// Scrape data from one site and place it into the mongodb db

  // Make a request for the news section of ycombinator

    // Load the html body from request into cheerio

    // For each element with a "title" class

      // Save the text and href of each link enclosed in the current element

      // If this found element had both a title and a link

        // Insert the data in the scrapedData db

            // Log the error if one is encountered during the query

            // Otherwise, log the inserted data

  // Send a "Scrape Complete" message to the browser

// Listen on port 3000
app.listen(PORT, () => console.log(`app running on port: ${PORT}`));

