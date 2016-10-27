var fs = require('fs');

// Putting the data in this file is a hack. Even when using
// a json file as data, we should really put the data management
// in a file separate from the routes file.
var tasObj;
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    tasObj = JSON.parse(data);
});

exports.allAppl = function(req, res) {
	console.log(req.params.status);
	console.log(JSON.stringify(tasObj));
	res.send(JSON.stringify(tasObj));
};

exports.applByStatus = function(req, res) {
	console.log("Find Applicants by status")
	console.log(req.params.status);
    var status = req.params.status;
    var statusObj =  JSON.stringify(tasObj);

    for(var i = 0; i < statusObj.tas.length; i++) {
    	if(statusObj.tas[i].status = status){
    		console.log(JSON.stringify(tasObj.tas[i].status));
    	}
    }
    console.log(JSON.stringify(tasObj.tas[status]));
    res.send(JSON.stringify(tasObj.tas[status]));
};

exports.addAppl = function(req, res) {
    console.log(req.body);
    var newta = req.body;
    
    tasObj.tas.push(newta);
    console.log("Success:");
    console.log(JSON.stringify(tasObj));
    res.send("Success");
};