//Variables
var statusText = 'Undergrad';

function selectStatus(){
    let select = document.getElementById("statusSelect");
    let i = select.selectedIndex;
    statusText = select.options[i].text;
    //alert(statusText);
    console.log(statusText);
}

function printList(taList){
    let parent = $('#results');
    for(let i = 0; i < taList.length; i++) {
        let tmp = $('<li>').text(taList[i].givenname + '  ' + 
                             taList[i].familyname + ' ' +
                             taList[i].status + ' ' +
                             taList[i].year);
        parent.append(tmp);
    }

}

// jQuery Documentpos
$(document).ready(function() {

    $("#RemoveByStunum").submit(function (e) {
        e.preventDefault();
        let num = $('#removeStunum').val();
        $.ajax({
            // The book id is part of the resource
            url: '/applicants?stunum=' + num,
            type: 'DELETE',
            success: function result() {
                location.reload(true);
            }
        });

    });

    $("#AddAppl").submit(function (e) {
        //alert("@AddAppl");
        //alert($('form').serialize());
        e.preventDefault();
        console.log($('form').serialize());
        $.post('/addapplicant', $('form').serialize());
        //location.reload(true);
    });

    $("#ApplByStatus").submit(function (e) {
        //TODO: Prevent adding more than once with multiple clicks
        //TODO sort by familyname
        //alert("@AddByStatus");
        e.preventDefault();
        $.get("/applicants?status='"+statusText+"'", function(data){
            let taObj = JSON.parse(data);
            printList(taObj.tas);
        });
    });

    $("#AllAppl").submit(function (e) {
        //TODO: Prevent adding more than once with multiple clicks
        //TODO sort by familyname
        e.preventDefault();
        $.get('/applicants', function(data){
            let taObj = JSON.parse(data);
            printList(taObj.tas);
        });
    });
});
