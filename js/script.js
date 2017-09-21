var storage = [
    {
        id: 1,
        fullName: "Sidorov Vlad",
        Qualification: "front-end developer",
        startVacation: "",
        endVacation:"",
        summVacationDays: 0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 2,
        fullName: "Kozlov Vlad",
        Qualification: "designer",
        startVacation: "25.06.17",
        endVacation:"6.07.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 3,
        fullName: "Ivanov Ivan",
        Qualification: "front-end developer",
        startVacation:"25.06.17",
        endVacation:"3.07.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 4,
        fullName: "Petrov Ivan",
        Qualification: "front-end developer",
        startVacation:"10.09.17",
        endVacation:"19.09.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 5,
        fullName: "Kositsin Ivan",
        Qualification: "back-end developer",
        startVacation:"4.11.17",
        endVacation:"16.11.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 6,
        fullName: "Moikin Ivan",
        Qualification: "back-end developer",
        startVacation: "12.09.17",
        endVacation:"23.09.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 7,
        fullName: "Moikin Dmitry",
        Qualification: "designer",
        startVacation: "25.02.17",
        endVacation:"6.03.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
    },
    {
        id: 8,
        fullName: "Moikina Irina",
        Qualification: "designer",
        startVacation:"18.06.17",
        endVacation:"22.06.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: []
        /* firstSumm, 1 загрузка хранилища. 
        /* none, если отпуск не начался
        not, если отпуск начался и но дни не добавились 
        yes, если отпуск начался и дни отпусков сложились*/
    },
    {
        id: 9,
        fullName: "Okala-Kulak Vladimir",
        Qualification: "back-end developer",
        startVacation:"22.12.17",
        endVacation:"26.12.17",
        summVacationDays:0,
        addDays: "firstSumm",
        lastVacation: [] 
    }
];

if( !(localStorage.getItem("key"))) {
    var strWorkers = JSON.stringify(storage);
    localStorage.setItem("key", strWorkers);
}
//localStorage.clear();
var Workers = JSON.parse(localStorage.getItem("key"));
/*var currentDate = new Date();*/
var currentDate = moment();
console.log(currentDate);
var ChangeCount = 0;

for (var i = 0; i<Workers.length; i++) {

    var worker = Workers[i];
    var start = moment(worker.startVacation, "DD.MM.YY");
    var end = moment(worker.endVacation, "DD.MM.YY");
    var days = end.diff(start, "days") + 1;
    //console.log(end.isValid());
    /*var start = toDate(('' + worker.startVacation));
    var end = toDate(('' + worker.endVacation));*/
    //var days = (end - start)/1000/3600/24 + 1;
    /*if (!worker.lastVacation[0] && (worker.endVacation != "") && currentDate > end) { */
        /*console.log(currentDate.isAfter(end))
        console.log(worker.fullName);*/
    if (!worker.lastVacation[0] && start.isValid() && (currentDate.isAfter(end))) {
        worker.lastVacation = [ worker.startVacation , worker.endVacation];
        ChangeCount++;
    }
    if (worker.addDays === "firstSumm" && (worker.summVacationDays === 0) && end.isValid()/*(worker.endVacation != "")*/) {
        worker.summVacationDays += days; 
        ChangeCount++;
    }
    
    if (worker.summVacationDays > 24) { /* проверить summvacationDAys, НЕ ЗАБЫТЬ УБРАТЬ */
        alert("ЗАМЕС!");
    }
    if /*(((currentDate - start) > 0) && ((end - currentDate)>0) && (worker.addDays == "none"))*/
    (currentDate.isAfter(start) && end.isAfter(currentDate) && (worker.addDays == "none")) {
        worker.addDays = "not";
    }
    if /*(((currentDate - start) > 0) && ((end - currentDate)>0) && (worker.addDays == "not"))*/ 
        (currentDate.isAfter(start) && end.isAfter(currentDate) && (worker.addDays == "not")) {
        worker.summVacationDays += days;
        worker.addDays = "yes"; 
        ChangeCount++;
    }
    if (currentDate > end) {
        worker.addDays = "none";
    }
}
if (ChangeCount > 0) {
    ChangeCount = 0;
    ChangeStorage();
    window.location.reload();
}
console.log(Workers);

function toDate(date) {
    
    var dot = date.indexOf(".");
    var thisdate = +date.substring(0, dot);
    var thismonth= +date.substring(dot+1) -1;
    var resDate = new Date(currentDate.getFullYear(), thismonth, thisdate);
    return resDate;
}

function ColorClass(date, start, end) {

    //var start = toDate(startVacation);
    //var end = toDate(endVacation);
    var start = moment(start, "DD.MM.YY");
    var end = moment(end, "DD.MM.YY");
    //if(date - end > 0) {
    if (date.isAfter(end) || !end.isValid()) {
        return 'yellow';
    }
    //else if(start - date > 0) {
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
        //function toNumbers (string) {
        //    var dot = string.indexOf(".");
        //    var thisdate = +string.substring(0, dot);
        //    var thismonth= +string.substring(dot+1) -1;
        //    return [thismonth, thisdate];
        //}
        //var elem1 = toNumbers(a.startVacation);
        //var elem2 = toNumbers(b.startVacation);

        //elem1[2] = a.fullName;
        //elem2[2] = b.fullName;

        //for (var i = 0; i< elem1.length; i++) {
        //    var sort = Sorting(elem1[i], elem2[i]);
        //    if (sort != 0) {
        //        return sort;
        //    }
        //}
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
function reload(time) { /*нужно переделать*/
    setTimeout(function() {

        ChangeStorage();
        window.location.reload();}, time);
}
function ChangeStorage() {
    var NewStorage = Workers;
    localStorage.clear();
    var strWorkers = JSON.stringify(NewStorage);
    localStorage.setItem("key", strWorkers);
}

function checkName(name) {
    var nameSplit = name.split(' ');
    for (var i=0; i<nameSplit.length; i++) {
        nameSplit[i] = encodeURIComponent(nameSplit[i]);
    }
    var nameJoin = nameSplit[0];
    for(var i=1; i<nameSplit.length; i++) {
        nameJoin += " " + nameSplit[i];
    }
    return nameJoin;
}

function findWorker(string) {
    var worker;
    var number;
    for (var i=0; i<Workers.length; i++) {
        if (Workers[i].fullName == string) {
            worker = Workers[i];
            number = i;
        }
    }
    var res = [number , worker] || false;
    return res;
}

$(document).ready(function () {
    //console.log(Workers);
    Workers = dateSort(Workers);
    addHTML();
    reload(1000*3600*12); /*нужно переписать для даты, добавляем count, когда data меняет день */
    
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
    $(".vacation-form" ).toggle();
    //$(".delete-form").hide();
});

$(".delete-vacation").on("click", function(){
    $(".delete-form").toggle();
    //$(".vacation-form").hide();
});

$("body").on("submit",".delete-form", function() {
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();

    var nameJoin = checkName(name);
    var find = findWorker(nameJoin);
    if (find) { 
        var number = find[0]; 
        var worker = find[1]; 

        //var start = toDate(worker.startVacation);
        //if (start > currentDate) {
        var start = moment(worker.startVacation, "DD.MM.YY");
        if (start.isAfter(currentDate)) {
            worker.startVacation = worker.lastVacation[0] || '';
            worker.endVacation = worker.lastVacation[1] || '';

            ChangeStorage();
            window.location.reload();
        } else {
            alert("можно удалить только будущий отпуск");
        }
    }
    return false;
});

$("body").on("submit",".vacation-form", function() {
    
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();
    var startVacation = (thisForm).children().children('#start-vacation').val();
    var endVacation = (thisForm).children().children('#end-vacation').val();
    var nameJoin = checkName(name);
    
    function dateCheck (start, end) {
        var start = moment(start, "DD.MM.YY");
        var end = moment(end, "DD.MM.YY");
        if (start.isValid() && end.isValid()) {
            return true;
        }
        return false;
    }
    var dateCheck = dateCheck(startVacation, endVacation);
    if (!dateCheck) { // проверить, правильно ли работает
        alert("данные не верны")
        return false;
    }
    //startVacation = encodeURIComponent(startVacation);
    //endVacation = encodeURIComponent(endVacation);

    var find = findWorker(nameJoin);
    if (find) { 
        var number = find[0]; 
        var worker = find[1]; 

        var startStorageDay;
        var endStorageDay;
        if(worker.startVacation) {
            //var startStorageDay = toDate(worker.startVacation); 
            //var endStorageDay = toDate(worker.endVacation); 
            var startStorageDay = moment(worker.startVacation, "DD.MM.YY"); 
            var endStorageDay = moment(worker.endVacation, "DD.MM.YY");
        }
        
        //var startFormDay = toDate(startVacation);
        //var endFormDay = toDate(endVacation);
        var startFormDay = moment(startVacation, "DD.MM.YY")
        var endFormDay = moment(endVacation, "DD.MM.YY");
        console.log(startFormDay);
        console.log(endFormDay);
        //var days = (endFormDay - startFormDay)/1000/3600/24 + 1;
        var days = end.diff(start, "days") + 1;

        function rewriteStorage1() {
            //if ((currentDate - startFormDay) > 0) {
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
                //if(((currentDate - endStorageDay) < 0) && ((currentDate - startStorageDay)>0)) { 
                if(endStorageDay.isAfter(currentDate) && currentDate.isAfter(startStorageDay)) { 
                    alert("вы не можете ставить новый отпуск во время существующего");
                    return false;
                }
                //if(((endStorageDay - startStorageDay)>(startFormDay - endStorageDay))&& ((currentDate - endStorageDay) > 0)) { 
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
                        /*var newStartDay = moment(Workers[i].startVacation, "DD.MM.YY");
                        var newEndDay = moment(Workers[i].endVacation, "DD.MM.YY");*/

                        if ( ((startFormDay >= newStartDay) && (startFormDay <= newEndDay)) || 
                            ((endFormDay >= newStartDay) && (endFormDay <= newEndDay)) ||
                            ((startFormDay <= newStartDay) && (endFormDay >= newEndDay))) { 
                        /*if ( ((startFormDay.isAfter(newStartDay) || startFormDay.isSame(newStartDay)) &&
                            (startFormDay.isBefore(newEndDay) || startFormDay.isSame(newEndDay))) ||   
                            ((endFormDay.isAfter(newStartDay) || endFormDay.isSame(newStartDay)) && // 2
                            (endFormDay.isBefore(newEndDay) || endFormDay.isSame(newEndDay))) ||   
                            ((startFormDay.isBefore(newStartDay) || startFormDay.isSame(newStartDay)) &&  // 3
                            (endFormDay.isAfter(newEndDay) || endFormDay.isSame(newEndDay))) ) {*/

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
        //console.log([success1, success2]);
        if (success1 && success2) {

            worker.startVacation = startVacation;
            worker.endVacation = endVacation;

            ChangeStorage();
            window.location.reload();
        }      
    } else {
        alert("нет данного сотрудника, повторите попытку");
    }
    return false;
});