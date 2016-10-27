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
	var returnList = [];
	if(req.query.status != undefined){
		var statusStr = req.query.status.substr(1,req.query.status.length-2);
		console.log(statusStr);
		for(var i = 0; i < tasObj.tas.length;i++){
			console.log(statusStr.localeCompare(tasObj.tas[i].status) == 0);
			if(statusStr.localeCompare(tasObj.tas[i].status) == 0){
				returnList.push(tasObj.tas[i]);
			}
		}
		console.log(returnList);
	} else{
		returnList = tasObj.tas;
	}
	var returnObj = {"tas":returnList};
	console.log(JSON.stringify(returnObj));
	res.send(JSON.stringify(returnObj));
};

//Returns a list of TA objects with status == status
/*
function applByStatus(status){
	var statusList = [];
	console.log(status);
	for(var i = 0; i < tasObj.tas.length;i++){
		console.log(tasObj.tas[i].status);
		console.log(status.localeCompare(tasObj.tas[i].status));
		var taStatus = tasObj.tas[i].status;
		if(status.localeCompare(taStatus) == 0){
			statusList.push(tasObj.tas[i]);
		}
		//if(tasObj.tas[i].status == status){}
	}
	console.log(statusList);
	return statusList;
}*/


exports.addAppl = function(req, res) {
    console.log(req.body);
    var newta = req.body;
    
    tasObj.tas.push(newta);
    console.log("Success:");
    console.log(JSON.stringify(tasObj));
    res.send("Success");
};

exports.delete = function(req, res) {
    var id = parseInt(req.params.id);
    //tasObj.longlist.splice(id-1,1);
    console.log("Success:");
    console.log(JSON.stringify(bookObj))
    res.send("Success");
};