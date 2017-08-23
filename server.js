// Dependencies
let bodyParser=require ("bodyParser");
// Require request and cheerio. This makes the scraping possible


// Initialize Express


// Database configuration


// Hook mongojs configuration to the db variable


// Main route (simple Hello World Message)


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
