//Dependencies
//Initalize Express
var express = require('express');
var app = express();

//Data for server
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');

//Scraper for website
var cheerio = require('cheerio');
var request = require('request');

//Database config
var mongojs = require('mongojs');
var databaseURL = "news";
var collections = ["stories"];

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// BodyParser interprets data sent to the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//Connects mongojs config to the db variable
var db = mongojs(databaseURL, collections);
db.on('error', function(err){
	console.log("Database Error:", err);
});

// Routes

//Route 1 opens main page
app.get('/', function(req, res) {
 
  res.render('index');
});

//Route 2 scrapes data from website and saves it to MongoDB
app.post('/submit', function(req, res){

	//pulls info using request npm from website
request('http://elitedaily.com/category/news/', function(err, res, body){
	var $ = cheerio.load(body);
	
	//pulls all of the h2 values for the body of the site
	$('h2').each(function(i, element){
		//console.log($(this).text());


		//grabs the text of all of the h2 values and looks for the link that is related to those values
		var title = $(this).text();
		var link = $(this).find('a').attr('href');

		//pushes those values into the results array
		results.push({
			title: title,
			url: link,
			thoughts: []
		});

		console.log(results);
		//pushes those values into the results array
		db.stories.insert(results, function(err, result){
			if (err){
		    console.log(err);
			}
			else{
		    res.send(result); //sends something back to ensure that it worked 
			}
		});
		
	  });

	});
});



//uses local port 8080 or any available if local is not available
var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log("Listening on %d", PORT);
});