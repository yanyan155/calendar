
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
    reload(1000*3600*12); 
    
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
    
    /*function dateCheck (start, end) {
        var start = moment(start, "DD.MM.YY");
        var end = moment(end, "DD.MM.YY");
        if (start.isValid() && end.isValid()) {
            return true;
        }
        return false;
    }
    var nameJoin = checkName(name);
    var dateCheck = dateCheck(startVacation, endVacation);
    if (!dateCheck) { 
        alert("данные не верны")
        return false;
    }


    var find = findWorker(nameJoin);
    if (find) { 
        var number = find[0]; 
        var worker = find[1]; 

        var startStorageDay;
        var endStorageDay;
        if(worker.startVacation) {

            var startStorageDay = moment(worker.startVacation, "DD.MM.YY"); 
            var endStorageDay = moment(worker.endVacation, "DD.MM.YY");
        }
        
        var startFormDay = moment(startVacation, "DD.MM.YY")
        var endFormDay = moment(endVacation, "DD.MM.YY");

        var days = end.diff(start, "days") + 1;

        function rewriteStorage1() {

            if (currentDate.isAfter(startFormDay)) {
                alert("вы не можете ставить отпуск в прошлом!");
                return false;
            }
            if(days <2){
                alert("минимальный непрерывный период отпуска - 2 календарных дня");
                return false;
            }
            if(days >15) {
                alert("максимальный непрерывный период отпуска - 15 календарных дней");
                return false;
            }
            if((+worker.summVacationDays + days)>24) {
                alert("максимальное количество дней отпуска в году - 24 календарных дня");
                return false;
            }
            if (worker.startVacation) {
                if(endStorageDay.isAfter(currentDate) && currentDate.isAfter(startStorageDay)) { 
                    alert("вы не можете ставить новый отпуск во время существующего");
                    return false;
                }
                if(((endStorageDay.diff(startStorageDay, "days") - startFormDay.diff(endStorageDay, "days"))>0)&& (currentDate.isAfter(endStorageDay))) { 
                    alert("минимальный период между периодами отпуска равен размеру первого отпуска");
                    return false;
                }
                return true;
            }
            return true;
        }
        function rewriteStorage2() {
            var notSameVacation = -1;
            var SameVacation = 0;
            for (var i=0; i<Workers.length; i++) {
                if ((worker.Qualification == Workers[i].Qualification)) {
                    notSameVacation++;
                    if((Workers[i].startVacation != "")&&(i != number)) {

                        var newStartDay = toDate(Workers[i].startVacation);
                        var newEndDay = toDate(Workers[i].endVacation);
                        var startFormDay = toDate(worker.startVacation);
                        var endFormDay = toDate(worker.endVacation);

                        if ( ((startFormDay >= newStartDay) && (startFormDay <= newEndDay)) || 
                            ((endFormDay >= newStartDay) && (endFormDay <= newEndDay)) ||
                            ((startFormDay <= newStartDay) && (endFormDay >= newEndDay))) { 

                            SameVacation++;
                        }
                    }
                }
            }
            if((notSameVacation/2) <= SameVacation) {
                alert("в отпуске имеют право находиться не более 50% сотрудников одной должности");
                return false;
            }
            else {
                return true;
            }
        }
        var success1 = rewriteStorage1();
        var success2 = rewriteStorage2();
        if (success1 && success2) {

            worker.startVacation = startVacation;
            worker.endVacation = endVacation;

            ChangeStorage();
            window.location.reload();
        }      
    } else {
        alert("нет данного сотрудника, повторите попытку");
    }*/
    return false;
});