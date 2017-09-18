const express = require("express");

const logger = require("morgan");
//let mongojs = require('mongojs');
const mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");
// Requiring our Note and Article models
const Note = require("../models/Note.js");
const News = require("../models/News.js");

const router = express.Router();

// Main route, should render index.handlebars
router.get("/", function(req, res) {
	res.render("index");
});

//write a function that checks for errors
//@TODO: rewrite this code using async/await and/or promises

router.get("/scrape", function(req, res) {
	request("https://medium.com/", function(error, response, html) {
		if (!error && response.statusCode == 200) {
			let $ = cheerio.load(html);

			$("h3.u-contentSansBold").each(function(i, element) {
				//$('article.h3').each(function(i, element) {

				let result = {};
				result.title = $(this).text();
				result.text = $(this)
					.parent("a")
					.text();
				result.link = $(this)
					.parent("a")
					.attr("href");
				console.log(result);

				let entry = new News(result);

				entry.save(function(err, doc) {
					if (err) {
						console.log(err);
					} else {
						console.log(doc);
					}
				});
			});

			return res.json("scrape complete");
		}
	});
});

//retrieves from the db all of the articles scraped
router.get("/articles", function(req, res) {
	News.find({}, function(error, doc) {
		if (error) {
			console.log(error);
		} else {
			//res.json(doc);
			res.render("index", { article: doc });
		}
	});
});

//retrieves from the db a specific article
router.get("/articles/:id", function(req, res) {
	News.findOne({ _id: req.params.id })
		.populate("")
		.exec(function(error, doc) {
			if (error) {
				console.log(error);
			} else {
				res.json(doc);
			}
		});
});

module.exports = router;
