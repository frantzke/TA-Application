var fs = require('fs');

// Putting the data in this file is a hack. Even when using
// a json file as data, we should really put the data management
// in a file separate from the routes file.
var tasObj;
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    tasObj = JSON.parse(data);
});

exports.findAll = function(req, res) {
	console.log(JSON.stringify(tasObj));
    res.send(JSON.stringify(tasObj));
};
