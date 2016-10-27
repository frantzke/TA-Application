//Variables
var statusText = 'Undergrad';

function selectStatus(){
    let select = document.getElementById("statusSelect");
    let i = select.selectedIndex;
    statusText = select.options[i].text;
    //alert(statusText);
    console.log(statusText);
}

// jQuery Documentpos
$(document).ready(function() {

    $("#AddAppl").submit(function (e) {
        alert("@AddAppl");
        alert($('form').serialize());
        e.preventDefault();
        console.log($('form').serialize());
        $.post('/addapplicant', $('form').serialize());
        location.reload(true);

    });

    $("#ApplByStatus").submit(function (e) {
        //TODO: Prevent adding more than once with multiple clicks
        //TODO sort by familyname
        alert("@AddByStatus");
        e.preventDefault();
        $.get("/applicants?status='"+statusText+"'", function(data){
            let parent = $('#results');
            let taObj = JSON.parse(data);
            let taArray = taObj.tas;
            for(let i = 0; i < taArray.length; i++) {
                let tmp = $('<li>').text(taArray[i].givenname + '  ' + 
                                     taArray[i].familyname + ' ' +
                                     taArray[i].status + ' ' +
                                     taArray[i].year);
                parent.append(tmp);
            }
        });
    });

    $("#AllAppl").submit(function (e) {
        //TODO: Prevent adding more than once with multiple clicks
        //TODO sort by familyname
        e.preventDefault();
        $.get('/applicants', function(data){
            let parent = $('#results');
            let taObj = JSON.parse(data);
            let taArray = taObj.tas;
            for(let i = 0; i < taArray.length; i++) {
                let tmp = $('<li>').text(taArray[i].givenname + '  ' + 
                                     taArray[i].familyname + ' ' +
                                     taArray[i].status + ' ' +
                                     taArray[i].year);
                parent.append(tmp);
            }
        });
        //location.reload(true);
        //buildList();
    });

function buildList() {
    $.get('applicants', function (data) {
        let parent = $('#results');
        let taObj = JSON.parse(data);
        let taArray = taObj.tas;
        for(let i = 0; i < taArray.length; i++) {
            let tmp = $('<li>').text(taArray[i].givenname + '  ' + 
                                     taArray[i].familyname + ' ' +
                                     taArray[i].status + ' ' +
                                     taArray[i].year);
                parent.append(tmp);
        }
    });
}

//buildList();

});
