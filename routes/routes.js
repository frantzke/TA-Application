var fs = require('fs');

// Putting the data in this file is a hack. Even when using
// a json file as data, we should really put the data management
// in a file separate from the routes file.
var tasObj;
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    tasObj = JSON.parse(data);
});

var coursesObj;
fs.readFile('courses.json', 'utf-8', function(err, data) {
    if(err) throw err;
    coursesObj = JSON.parse(data);
});

exports.allAppl = function(req, res) {
	//console.log(req);
	console.log(req.query);
	console.log("Type: "+req.type);
	//List of TAs to return
	var returnList = [];
	//If a status query is provided
	if(req.query.status != undefined){
		//Format string to be compared
		var statusStr = req.query.status.substr(1,req.query.status.length-2);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			//console.log(statusStr.localeCompare(tasObj.tas[i].status) == 0);
			if(statusStr.localeCompare(tasObj.tas[i].status) == 0){
				returnList.push(tasObj.tas[i]);
			}
		}
		console.log(returnList);
	} else if(req.query.fname != undefined){
		var fnameStr = req.query.fname.substr(1,req.query.fname.length-2);
		for(var i = 0; i < tasObj.tas.length;i++){
			//console.log(fnameStr.localeCompare(tasObj.tas[i].fname) == 0);
			if(fnameStr.localeCompare(tasObj.tas[i].familyname) == 0){
				returnList.push(tasObj.tas[i]);
			}
		}
	} else{
		returnList = tasObj.tas;
	}
	//Create a object to return
	var returnObj = {"tas":returnList};
	console.log(JSON.stringify(returnObj));
	res.send(JSON.stringify(returnObj));
};

exports.addAppl = function(req, res) {
    console.log(req.body);
    var newta = req.body;
    
    tasObj.tas.push(newta);
    console.log("Success:");
    console.log(JSON.stringify(tasObj));
    res.send("Success");
};

exports.deleteAppl = function(req, res) {
    console.log(req.query);
    if(req.query.stunum != undefined){
    	//var stunumStr = req.query.stunum.substr(0,req.query.stunum.length-2);
    	console.log(req.query.stunum);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			if(req.query.stunum.localeCompare(tasObj.tas[i].stunum) == 0){
				//Remove TA
				console.log(tasObj.tas[i]);
				tasObj.tas.splice(i,1);
			}
		}
    } else if(req.query.fname != undefined){
    	//var stunumStr = req.query.stunum.substr(0,req.query.stunum.length-2);
    	console.log(req.query.fname);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			if(req.query.fname.localeCompare(tasObj.tas[i].familyname) == 0){
				//Remove TA
				console.log(tasObj.tas[i]);
				tasObj.tas.splice(i,1);
			}
		}
    }
    console.log("Success:");
    console.log(JSON.stringify(tasObj));
    res.send("Success");
};

exports.findCourses = function(req, res) {
	console.log(req.query);
	//List of TAs to return
	//{courseList: [{courseName: [{ranking:0, experiene:0, status:Undergrad, givenname:name, familyname:name}]}]}
	var courseList = [];
	//Add all courses
	for (var i = 0; i < coursesObj.courses.length; i++){
		console.log(coursesObj.courses[i]);
		courseList.push(coursesObj.courses[i] : []);
	}

	for (var i=0; i < tasObj.tas.length; i++){
		for(var j=0; j < tasObj.tas[i].courses.length; j++){
			//var courseIndex = courseList.indexOf(tasObj.tas[i].courses[j].code);
			//courseList.push(tasObj.tas[i]);
		}
	}
	//Create a object to return
	var returnObj = {"courses":courseList};
	console.log(JSON.stringify(returnObj));
	res.send(JSON.stringify(returnObj));
};