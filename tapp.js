var express = require('express');
var app = express();
var bodyParser = require('body-parser');


// Set views path, template engine and default layout
app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


var server = app.listen(3000, function()
{
  var port = server.address().port;
  console.log('Running on 127.0.0.1:%s', port);
});