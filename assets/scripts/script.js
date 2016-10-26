// jQuery Documentpos
$(document).ready(function() {
	
function buildList() {
    $.get('tas', function (data) {
        let parent = $('#results');
        let taObj = JSON.parse(data);
        let taArray = taObj.tas;
        for(let i = 0; i < taArray.length; i++) {
            let tmp = $('<li>').text(taArray[i].givenname + '  ' + 
                                     taArray[i].familyname);
                parent.append(tmp);
        }
    });
}

buildList();

});
