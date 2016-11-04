//Variables
var statusText = 'Undergrad';

//Changes the Status for List by Status
function selectStatus(){
    let select = document.getElementById("statusSelect");
    let i = select.selectedIndex;
    statusText = select.options[i].text;
    console.log(statusText);
}

//Comparison to sort tas by familyname
function compare(ta,otherTa) {
    if (ta.familyname < otherTa.familyname)
        return -1;
    if (ta.familyname > otherTa.familyname)
        return 1;
    return 0;
}

//Comparison to sort courses by rank
function compareCourse(c1,c2){
    return c1.rank - c2.rank;
}

//Print a list of TAs to a location on index.html
function printList(taList, printLocation){
    //Sorts list by family name
    taList.sort(compare);
    let parent = $(printLocation);
    //clear field
    parent.empty();
    //Header table row
    let tableRow = $("<tr></tr>");
    tableRow.append($("<th></th>").text("Given Name"));
    tableRow.append($("<th></th>").text("Family Name"));
    tableRow.append($("<th></th>").text("Status"));
    tableRow.append($("<th></th>").text("Year"));
    parent.append(tableRow);
    //Add Ta info row
    for(let i = 0; i < taList.length; i++) {
        let tableRow = $("<tr></tr>");
        tableRow.append($("<td></td>").text(taList[i].givenname));
        tableRow.append($("<td></td>").text(taList[i].familyname));
        tableRow.append($("<td></td>").text(taList[i].status));
        tableRow.append($("<td></td>").text(taList[i].year));
        parent.append(tableRow);
    }
}

//print a single applicant
function printApplicant(ta){
    //Set applicant print location
    let parent = $("#ApplByNameTable");
    //clear table
    parent.empty();
    parent.append($("<caption></caption").text("Applicant"));
    //Set applicant table header
    let tableRowHead = $("<tr></tr>");
    tableRowHead.append($("<th></th>").text("Given Name"));
    tableRowHead.append($("<th></th>").text("Family Name"));
    tableRowHead.append($("<th></th>").text("Status"));
    tableRowHead.append($("<th></th>").text("Year"));
    parent.append(tableRowHead);
    //Add Ta info row
    let tableRow = $("<tr></tr>");
    tableRow.append($("<td></td>").text(ta.givenname));
    tableRow.append($("<td></td>").text(ta.familyname));
    tableRow.append($("<td></td>").text(ta.status));
    tableRow.append($("<td></td>").text(ta.year));
    parent.append(tableRow);
    //Set Courses print location
    let courseParent = $("#ApplByNameCourseTable");
    //clear course table
    courseParent.empty();
    //Sort Courses by rank
    ta.courses.sort(compareCourse);
    courseParent.append($("<caption></caption").text("Courses"));
    //Set courses table header
    let tableRowCourseHead = $("<tr></tr>");
    tableRowCourseHead.append($("<th></th>").text("Code"));
    tableRowCourseHead.append($("<th></th>").text("Rank"));        
    tableRowCourseHead.append($("<th></th>").text("Experience"));
    courseParent.append(tableRowCourseHead);
    //Add courses info rows
    for(let j =0; j < ta.courses.length; j++){
        let tableRow = $("<tr></tr>");
        tableRow.append($("<td></td>").text(ta.courses[j].code));
        tableRow.append($("<td></td>").text(ta.courses[j].rank));        
        tableRow.append($("<td></td>").text(ta.courses[j].experience));
        courseParent.append(tableRow);
    }   
}

//Print Courses to print location
function printCourses(courseList, printLocation){
    //Set courses print location
    let parent = $(printLocation);
    parent.empty();
    //Set courses table header
    let tableRowHead = $("<tr></tr>");
    tableRowHead.append($("<th></th>").text("Code"));
    tableRowHead.append($("<th></th>").text("Rank"));
    tableRowHead.append($("<th></th>").text("Experience"));
    tableRowHead.append($("<th></th>").text("Status"));
    tableRowHead.append($("<th></th>").text("Given Name"));
    tableRowHead.append($("<th></th>").text("Family Name"));
    parent.append(tableRowHead);
    //Add courses info rows
    for(let i = 0; i < courseList.length; i++) {
        //sort the rank of the courses for each TA
        courseList[i].tas.sort(compareCourse);
        for(let j =0; j < courseList[i].tas.length; j++){
            //Add course info to each row
            let tableRow = $("<tr></tr>");
            tableRow.append($("<td></td>").text(courseList[i].code));
            tableRow.append($("<td></td>").text(courseList[i].tas[j].rank));
            tableRow.append($("<td></td>").text(courseList[i].tas[j].experience));
            tableRow.append($("<td></td>").text(courseList[i].tas[j].status));
            tableRow.append($("<td></td>").text(courseList[i].tas[j].givenname));
            tableRow.append($("<td></td>").text(courseList[i].tas[j].familyname));
            parent.append(tableRow);
        }   
    }
}

// jQuery Documentpos
$(document).ready(function() {

    //Set search course by name button
    $("#SearchCourse").submit(function (e) {
        e.preventDefault();
        //get string from course field
        let course = $('#cours-name').val();
        $('#cours-name').val("");
        $.get('/courses?course='+course, function(data){
            let courseObj = JSON.parse(data);
            printCourses(courseObj.courses, "#SearchCoursesResult");
        });
    });

    //Set list all courses button
    $("#AllCourses").submit(function (e) {
        e.preventDefault();
        $.get('/courses', function(data){
            let courseObj = JSON.parse(data);
            printCourses(courseObj.courses, "#AllCoursesResult");
        });
    });

    //Delete by student number Button
    $("#RemoveByStunum").submit(function (e) {
        e.preventDefault();
        //get student number from number field
        let num = $('#removeStunum').val();
        $('#removeStunum').val("");
        $.ajax({
            url: '/applicants?stunum='+num ,
            type: 'DELETE',
            success: function(res) {
                //On return print the result to the page
                resultObj = JSON.parse(res);
                let result = $("#RemoveResult");
                result.text(resultObj.text);
                alert(resultObj.text);
            }
        });
    });

    //Delete by family name Button
    $("#RemoveByfname").submit(function (e) {
        e.preventDefault();
        //Get student name from removefname field
        let name = $('#removefname').val();
        $('#removefname').val("");
        $.ajax({
            url: '/applicants?fname='+name ,
            type: 'DELETE',
            success: function(res) {
                //print sucess or Error: no such student
                //on return to the page
                resultObj = JSON.parse(res);
                let result = $("#RemoveResult");
                alert(resultObj.text);
                result.text(resultObj.text);
            }
        });
    });

    //Add applicant button
    $("#AddAppl").submit(function (e) {
        e.preventDefault();
        console.log($('#AddAppl').serialize());
        $.ajax({
            url: '/applicants' ,
            type: 'POST',
            data: $('#AddAppl').serialize(),
            success: function(res) {
                //Print Success or Error: duplicate student number
                resultObj = JSON.parse(res);
                let result = $('#AddApplResult');
                result.text(resultObj.text);
                alert(resultObj.text);
            }
        });
        $('#AddAppl').trigger("reset");
    });

    //List applicants by family name
    $("#ApplByName").submit(function (e) {
        e.preventDefault();
        var name = $('#ApplName').val();
        $('#ApplName').val("");
        $.get("/applicants?fname='"+name+"'", function(data){
            let taObj = JSON.parse(data);
            if(taObj.tas[0] != undefined){
                printApplicant(taObj.tas[0]);
                $("#ApplFailResult").text("");
            } else {
                $("#ApplFailResult").text("Error: no such student");
                alert("Error: no such student");
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
