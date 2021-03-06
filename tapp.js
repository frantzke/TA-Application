//Express server
var express = require('express');
var tas = require('./routes/routes');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Get the index page:
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/applicants', tas.allAppl);

app.post('/applicants', tas.addAppl);

app.delete('/applicants', tas.deleteAppl);

app.get('/courses', tas.findCourses);

var server = app.listen(3000, function()
{
  var port = server.address().port;
  console.log('Running on 127.0.0.1:%s', port);
});
