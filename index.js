var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

// Load keywords defined in keywords.json
var keywords = require('./keywords.json');

// Create express web app
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

// Handle incoming texts
app.post('/message', function(request, response) {
    var body = request.param('Body').trim();

    // If the body is a keyword we know about, we're cool
    var responseData = keywords[body];

    // Otherwise, print a listing of known keywords
    if (!responseData) {
        responseData = { body: 'Please text one of the following words: ' };
        var keywordList = Object.keys(keywords);
        keywordList.forEach(function(key, i) {
            responseData.body += key;
            if ((i+1) < keywordList.length) {
                responseData.body += ', ';
            }
        });
    }

    // Render the proper TwiML (in a Jade template)
    response.type('text/xml');
    response.render('twiml.jade', responseData);
});

// Run server
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('express server running on port '+port);
});