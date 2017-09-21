function ColorClass(date, start, end) {

    var start = moment(start, "DD.MM.YY");
    var end = moment(end, "DD.MM.YY");
    if (date.isAfter(end) || !end.isValid()) {
        return 'yellow';
    }
    else if(start.isAfter(date)) {
        return 'green';
    } else {
        return 'blue';
    }
}
function nameSort(array) {
    array.sort(function(a,b){
        return Sorting(a.fullName, b.fullName);
    })
    return array;
}
function Sorting(elem1, elem2) {
    if (elem1 > elem2) {
        return 1;
    }
    if (elem1 < elem2) {
        return -1;
    }
    return 0;
}
function dateSort(array) {
    
    array.sort(function(a,b){
        if(a.startVacation) {

        }
        var elem1 = moment(a.startVacation, "DD.MM.YY");
        var elem2 = moment(b.startVacation, "DD.MM.YY");

        if(elem1.isSame(elem2) || (!elem1.isValid() && !elem2.isValid())) {
            return Sorting(a.fullName, b.fullName);
        }
        if(elem1.isAfter(elem2) || !elem2.isValid()) {
            return 1;
        } else if(elem2.isAfter(elem1) || !elem1.isValid()) {
            return -1;
        }
        return 0;
    })
    return array;
}
function deleteHTML() {
    for (var i=2; i<Workers.length+2; i++) {
        var b = $(".calendar tbody").children(":nth-child(2)").remove();
    }
}
function addHTML() {
    for (var i=0; i<Workers.length; i++) {

        var color = ColorClass(currentDate, Workers[i].startVacation, Workers[i].endVacation);
        var WorkerInfo ='<tr>';
        WorkerInfo += '<td>' + Workers[i].fullName + '</td>';
        WorkerInfo += '<td>' + Workers[i].Qualification + '</td>';
        WorkerInfo += '<td ' + 'class="' + color + '" >' + Workers[i].startVacation + '</td>';
        WorkerInfo += '<td ' + 'class="' + color + '" >' + Workers[i].endVacation + '</td>';
        WorkerInfo += '</tr>';
        var insertInfo = $('.calendar tbody').append(WorkerInfo);
    }
}

$(document).ready(function () {

    Workers = dateSort(Workers);
    addHTML();
    
});

$(".date-sort").on("click", function(){
    Workers = dateSort(Workers);
    deleteHTML();
    addHTML();
});

$(".name-sort").on("click", function(){
    Workers = nameSort(Workers);
    deleteHTML();
    addHTML();
});

$(".edit-vacation").on("click", function(){
    $(".modal" ).show();
    $(".vacation-form" ).show();
});

$(".delete-vacation").on("click", function(){
    $(".modal" ).show();
    $(".delete-form").show();
});
$(".close-button").on("click", function(){
    $(".modal" ).hide();
    $(".delete-form").hide();
    $(".vacation-form").hide();
});

$("body").on("submit",".delete-form", function() {
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();
    var formdata = {name: name}
    var result = serverDeleteVacation(formdata);

    return false;
});

$("body").on("submit",".vacation-form", function() {
    
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();
    var startVacation = (thisForm).children().children('#start-vacation').val();
    var endVacation = (thisForm).children().children('#end-vacation').val();
    
    var formdata = {
        name: name,
        startVacation: startVacation,
        endVacation: endVacation };
    var result = serverEditVacation(formdata);

    return false;
});