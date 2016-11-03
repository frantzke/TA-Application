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

//Sort courses by rank
function compareCourse(c1,c2){
    return c1.rank - c2.rank;
}

//Print a list of TAs
function printList(taList, printLocation){
    //Sorts list by family name
    taList.sort(compare);
    let parent = $(printLocation);
    //clear field
    parent.empty();
    let tableRow = $("<tr></tr>");
    tableRow.append($("<th></th>").text("Given Name"));
    tableRow.append($("<th></th>").text("Family Name"));
    tableRow.append($("<th></th>").text("Status"));
    tableRow.append($("<th></th>").text("Year"));
    parent.append(tableRow);
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
    let parent = $("#ApplByNameTable");
    parent.empty();
    parent.append($("<caption></caption").text("Applicant"));
    let tableRowHead = $("<tr></tr>");
    tableRowHead.append($("<th></th>").text("Given Name"));
    tableRowHead.append($("<th></th>").text("Family Name"));
    tableRowHead.append($("<th></th>").text("Status"));
    tableRowHead.append($("<th></th>").text("Year"));
    parent.append(tableRowHead);
    let tableRow = $("<tr></tr>");
    tableRow.append($("<td></td>").text(ta.givenname));
    tableRow.append($("<td></td>").text(ta.familyname));
    tableRow.append($("<td></td>").text(ta.status));
    tableRow.append($("<td></td>").text(ta.year));
    parent.append(tableRow);
    let courseParent = $("#ApplByNameCourseTable");
    courseParent.empty();
    //Sort Courses by rank
    ta.courses.sort(compareCourse);
    parent.append($("<caption></caption").text("Courses"));
    let tableRowCourseHead = $("<tr></tr>");
    tableRowCourseHead.append($("<th></th>").text("Code"));
    tableRowCourseHead.append($("<th></th>").text("Rank"));        
    tableRowCourseHead.append($("<th></th>").text("Experience"));
    courseParent.append(tableRowCourseHead);
    for(let j =0; j < ta.courses.length; j++){
        let tableRow = $("<tr></tr>");
        tableRow.append($("<td></td>").text(ta.courses[j].code));
        tableRow.append($("<td></td>").text(ta.courses[j].rank));        
        tableRow.append($("<td></td>").text(ta.courses[j].experience));
        courseParent.append(tableRow);
    }   
}

function printCourses(courseList, printLocation){
    //TODO: Sort by rank
    let parent = $(printLocation);
    parent.empty();
    let tableRowHead = $("<tr></tr>");
    tableRowHead.append($("<th></th>").text("Code"));
    tableRowHead.append($("<th></th>").text("Rank"));
    tableRowHead.append($("<th></th>").text("Experience"));
    tableRowHead.append($("<th></th>").text("Status"));
    tableRowHead.append($("<th></th>").text("Given Name"));
    tableRowHead.append($("<th></th>").text("Family Name"));
    parent.append(tableRowHead);
    for(let i = 0; i < courseList.length; i++) {
        courseList[i].tasList.sort(compareCourse);
        for(let j =0; j < courseList[i].tasList.length; j++){
            let tableRow = $("<tr></tr>");
            tableRow.append($("<td></td>").text(courseList[i].coursename));
            tableRow.append($("<td></td>").text(courseList[i].tasList[j].rank));
            tableRow.append($("<td></td>").text(courseList[i].tasList[j].experience));
            tableRow.append($("<td></td>").text(courseList[i].tasList[j].status));
            tableRow.append($("<td></td>").text(courseList[i].tasList[j].givenname));
            tableRow.append($("<td></td>").text(courseList[i].tasList[j].familyname));
            parent.append(tableRow);
        }   
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
        e.preventDefault();
        console.log($('form').serialize());
        $.ajax({
            url: '/applicants' ,
            type: 'POST',
            data: $('#AddAppl').serialize(),
            success: function(res) {
                //Print Success or Error: duplicate student number
                resultObj = JSON.parse(res);
                let result = $('#AddApplResult');
                //alert(resultObj.text);
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
            //printList(taObj.tas, "#ApplByNameResult");
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
