//Variables
var statusText = 'Undergrad';

//Changes the Status for List by Status
function selectStatus(){
    let select = document.getElementById("statusSelect");
    let i = select.selectedIndex;
    statusText = select.options[i].text;
    console.log(statusText);
}

//Comparison to sort by familyname
function compare(ta,otherTa) {
    if (ta.familyname < otherTa.familyname)
        return -1;
    if (ta.familyname > otherTa.familyname)
        return 1;
    return 0;
}

//Print a list of TAs
function printList(taList, printLocation){
    //Sorts list by family name
    taList.sort(compare);
    let parent = $(printLocation);
    //clear field
    parent.empty();
    for(let i = 0; i < taList.length; i++) {
        let tmp = $('<li>').text(taList[i].givenname + '  ' + 
                             taList[i].familyname + ' ' +
                             taList[i].status + ' ' +
                             taList[i].year);
        parent.append(tmp);
    }
}

//print a single applicant
function printApplicant(ta){
    let parent = $("#ApplByNameResult");
    //clear field
    parent.empty();
    let taInfo = $("<li></li>").text(ta.givenname + ' ' +
        ta.familyname + ' ' +
        ta.status + ' ' +
        ta.year + ' ');
    parent.append(taInfo);
    let courseList = $('<ol></ol>');
    //parent.append(courseList);
    for(let j =0; j < ta.courses.length; j++){
        //alert(courseList[i].tasList[j].givenname);
        let course = $('<li></li>').text(ta.courses[j].code + ' ' + 
                    ta.courses[j].rank + ' '+ 
                    ta.courses[j].experience);
        courseList.append(course);
    }   
    parent.append(courseList);
}

function printCourses(courseList, printLocation){
    //TODO: Sort by rank
    let parent = $(printLocation);
    parent.empty();
    //alert(courseList.length);
    for(let i = 0; i < courseList.length; i++) {
        if(courseList[i].tasList.length >0){
            let courseCode = $('<li></li>').text(courseList[i].coursename);
            parent.append(courseCode);
        }
        let coursetmp = $('<ol></ol>');
        for(let j =0; j < courseList[i].tasList.length; j++){
            //alert(courseList[i].tasList[j].givenname);
            let tmp = $('<li></li>').text(courseList[i].tasList[j].rank + ' '+ 
                        courseList[i].tasList[j].experience + ' ' +
                        courseList[i].tasList[j].status + ' ' +
                        courseList[i].tasList[j].givenname + ' ' +
                        courseList[i].tasList[j].familyname);
            coursetmp.append(tmp);
        }   
        parent.append(coursetmp);
    }
}

// jQuery Documentpos
$(document).ready(function() {

    $("#SearchCourse").submit(function (e) {
        e.preventDefault();
        let course = $('#cours-name').val();
        $.get('/courses?course='+course, function(data){
            let courseObj = JSON.parse(data);
            printCourses(courseObj.courses, "#SearchCoursesResult");
        });
    });

    $("#AllCourses").submit(function (e) {
        e.preventDefault();
        //alert("@AllCourses")
        $.get('/courses', function(data){
            let courseObj = JSON.parse(data);
            printCourses(courseObj.courses, "#AllCoursesResult");
        });
    });

    //Delete by student number Button
    $("#RemoveByStunum").submit(function (e) {
        e.preventDefault();
        let num = $('#removeStunum').val();
        $.ajax({
            url: '/applicants?stunum='+num ,
            type: 'DELETE',
            success: function result() {
                location.reload(true);
            }
        });
    });

    //Delete by family name Button
    $("#RemoveByfname").submit(function (e) {
        e.preventDefault();
        let name = $('#removefname').val();
        $.ajax({
            url: '/applicants?fname='+name ,
            type: 'DELETE',
            success: function result() {
                location.reload(true);
            }
        });
    });

    //Add applicant button
    $("#AddAppl").submit(function (e) {
        //TODO: Check duplicates
        e.preventDefault();
        console.log($('form').serialize());
        $.post('/applicants', $('#AddAppl').serialize());
        $.ajax({
            url: '/applicants' ,
            type: 'POST',
            success: function(res) {
                //Print Success or Error: duplicate student number
                resultObj = JSON.parse(res);
                let result = $('#AddApplResult');
                alert(resultObj.text);
                result.text(resultObj.text);
            }
        });
    });

    //List applicants by family name
    $("#ApplByName").submit(function (e) {
        e.preventDefault();
        var name = $('#ApplName').val();
        $.get("/applicants?fname='"+name+"'", function(data){
            let taObj = JSON.parse(data);
            printList(taObj.tas, "#ApplByNameResult");
            if(taObj.tas[0] != undefined){
                printApplicant(taObj.tas[0]);
            }
        });
    });

    //List applicants by status Button
    $("#ApplByStatus").submit(function (e) {
        e.preventDefault();
        $.get("/applicants?status='"+statusText+"'", function(data){
            let taObj = JSON.parse(data);
            printList(taObj.tas, "#ApplByStatusResult");
        });
    });

    //List all Applicants Button
    $("#AllAppl").submit(function (e) {
        e.preventDefault();
        $.get('/applicants', function(data){
            let taObj = JSON.parse(data);
            printList(taObj.tas, "#AllApplResult");
        });
    });
});
