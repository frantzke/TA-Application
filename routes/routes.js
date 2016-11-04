var fs = require('fs');

// Putting the data in this file is a hack. Even when using
// a json file as data, we should really put the data management
// in a file separate from the routes file.
var tasObj;
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    tasObj = JSON.parse(data);
});

//Read course information from courses.json
var coursesObj;
fs.readFile('courses.json', 'utf-8', function(err, data) {
    if(err) throw err;
    coursesObj = JSON.parse(data);
});

//Return list of applicants
exports.allAppl = function(req, res) {
	console.log(req.query);
	//List of TAs to return
	var returnList = [];
	//If a status query is provided
	if(req.query.status != undefined){
		//Format string to be compared
		var statusStr = req.query.status.substr(1,req.query.status.length-2);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			//compare query status to TA status
			if(statusStr.localeCompare(tasObj.tas[i].status) == 0){
				//create new Ta object with only relevant info
				var newTa = {"stunum": tasObj.tas[i].stunum, 
							"givenname": tasObj.tas[i].givenname,
							"familyname": tasObj.tas[i].familyname,
							"status": tasObj.tas[i].status,
							"year":tasObj.tas[i].year}
				returnList.push(newTa);
			}
		}
	} else if(req.query.fname != undefined){ //if family name query is provided
		//Format family name string
		var fnameStr = req.query.fname.substr(1,req.query.fname.length-2);
		for(var i = 0; i < tasObj.tas.length;i++){
			//Compare family name to ta family name
			if(fnameStr.localeCompare(tasObj.tas[i].familyname) == 0){
				//Create new TA with only relevant info to return
				var newTa = {"stunum": tasObj.tas[i].stunum, 
							"givenname": tasObj.tas[i].givenname,
							"familyname": tasObj.tas[i].familyname,
							"status": tasObj.tas[i].status,
							"year":tasObj.tas[i].year,
							"courses": tasObj.tas[i].courses}
				returnList.push(newTa);
			}
		}
	} else{	//No query provided
		for(var i = 0; i < tasObj.tas.length;i++){
			//Create applicant with only relevant info
			var newTa = {"stunum": tasObj.tas[i].stunum, 
						"givenname": tasObj.tas[i].givenname,
						"familyname": tasObj.tas[i].familyname,
						"status": tasObj.tas[i].status,
						"year":tasObj.tas[i].year}
			returnList.push(newTa);
		}
	}
	//Create a object to return
	var returnObj = {"tas":returnList};
	console.log(JSON.stringify(returnObj));
	res.send(JSON.stringify(returnObj));
};

//Add new applicant
exports.addAppl = function(req, res) {
    console.log(req.body);
    //create new Ta from form info
    var newTa = req.body;
    //set errors to false, unless error found
    var err = false;
    //Set result text to error, unless sucessful
   	var result = {"text": "Error: duplicate student number"};
	for(var i = 0; i < tasObj.tas.length;i++){
		if(newTa.stunum.localeCompare(tasObj.tas[i].stunum) == 0){
			//Duplicate student TA number
			err = true;
		}
	}  
    if(!err){
    	//No error found, add new TA
    	tasObj.tas.push(newTa);
    	//Set text to sucess
    	result.text = "Success";
    }
    console.log(JSON.stringify(tasObj));
    console.log(JSON.stringify(result));
    res.send(JSON.stringify(result));
};

//Delete applicant
exports.deleteAppl = function(req, res) {
    console.log(req.query);
    //Set found to false unless applicant is found
    var found = false;
    //Set text to error unless applicant is found
    var result = {"text": "Error: no such student"};
    if(req.query.stunum != undefined){
    	console.log(req.query.stunum);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			if(req.query.stunum.localeCompare(tasObj.tas[i].stunum) == 0){
				//Remove TA
				console.log(tasObj.tas[i]);
				tasObj.tas.splice(i,1);
				found = true;
			}
		}
    } else if(req.query.fname != undefined){
    	console.log(req.query.fname);
		//compare string to all TA object status
		for(var i = 0; i < tasObj.tas.length;i++){
			if(req.query.fname.localeCompare(tasObj.tas[i].familyname) == 0){
				//Remove TA
				console.log(tasObj.tas[i]);
				tasObj.tas.splice(i,1);
				found = true;
			}
		}
    }
    //If a delete occured
    if(found){
    	//Set text to sucess
    	result.text = "Success";
    }
    console.log(JSON.stringify(tasObj));
    console.log(JSON.stringify(result));
    res.send(JSON.stringify(result));
};

//Find courses
exports.findCourses = function(req, res) {
	console.log(req.query);
	//List of TAs to return
	var courseList = [];
	if(req.query.course != undefined){ //course query provided
		console.log(req.query.course);
		//create object with code and tas to return
		var courseListItem = {code: req.query.course, tas: [] };
		courseList.push(courseListItem);
		for (var i=0; i < tasObj.tas.length; i++){
			for(var j=0; j < tasObj.tas[i].courses.length; j++){
				//compare course query to ta course code
				if(req.query.course.localeCompare(tasObj.tas[i].courses[j].code) == 0){
					var ta = {rank: tasObj.tas[i].courses[j].rank,
						experience:tasObj.tas[i].courses[j].experience,
					 	status: tasObj.tas[i].status,
					 	givenname: tasObj.tas[i].givenname,
					 	familyname: tasObj.tas[i].familyname};
					courseList[0].tas.push(ta);
				}
			}
		}
	} else { //List all courses
		//Keep a list of all course codes so find the index of course items later
		var courseIndexList = [];

		//Add all courses
		for (var i = 0; i < coursesObj.courses.length; i++){
			var courseListItem = {code: coursesObj.courses[i], tas: [] };
			courseList.push(courseListItem);
			//Add only course code string to look up later
			courseIndexList.push(coursesObj.courses[i]);
		}
		
		for (var i=0; i < tasObj.tas.length; i++){
			for(var j=0; j < tasObj.tas[i].courses.length; j++){
				//Find the index of course to append ta to in courseList
				var courseIndex = courseIndexList.indexOf(tasObj.tas[i].courses[j].code);
				if ( courseIndex > 0){
					var newTa = {rank: tasObj.tas[i].courses[j].rank,
						experience:tasObj.tas[i].courses[j].experience,
					 	status: tasObj.tas[i].status,
					 	givenname: tasObj.tas[i].givenname,
					 	familyname: tasObj.tas[i].familyname};
					//push ta to course object at the index found
					courseList[courseIndex].tas.push(newTa);
				}			
			}
		}
	}
	//Create a object to return
	var returnObj = {"courses":courseList};
	console.log(JSON.stringify(returnObj));
	res.send(JSON.stringify(returnObj));
};