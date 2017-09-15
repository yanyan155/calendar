var storage = [
    {
        id: 1,
        fullName: "Sidorov Vlad",
        Qualification: "front-end developer",
        startVacation: "",
        EndVacation:"",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 2,
        fullName: "Kozlov Vlad",
        Qualification: "designer",
        startVacation: "25.06",
        EndVacation:"6.07",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 3,
        fullName: "Ivanov Ivan",
        Qualification: "front-end developer",
        startVacation:"25.06",
        EndVacation:"3.07",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 4,
        fullName: "Petrov Ivan",
        Qualification: "front-end developer",
        startVacation:"25.03",
        EndVacation:"5.04",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 5,
        fullName: "Kositsin Ivan",
        Qualification: "back-end developer",
        startVacation:"4.11",
        EndVacation:"16.11",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 6,
        fullName: "Moikin Ivan",
        Qualification: "back-end developer",
        startVacation: "12.09",
        EndVacation:"23.09",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 7,
        fullName: "Moikin Dmitry",
        Qualification: "designer",
        startVacation: "25.02",
        EndVacation:"6.03",
        summVacationDays:0,
        addDays: "none"
    },
    {
        id: 8,
        fullName: "Moikina Irina",
        Qualification: "designer",
        startVacation:"18.06",
        EndVacation:"22.06",
        summVacationDays:0,
        addDays: "none" 
        /* none, если отпуск не начался
        not, если отпуск начался и но дни не добавились 
        yes, если отпуск начался и дни отпусков сложились*/
    }
];

if( !(localStorage.getItem("key"))) {
    var strWorkers = JSON.stringify(storage);
    localStorage.setItem("key", strWorkers);
}
/*var strWorkers = JSON.stringify(storage);
localStorage.setItem("key", strWorkers);*/
/*localStorage.clear();*/
var Workers = JSON.parse(localStorage.getItem("key"));
var currentDate = new Date();

for (var i = 0; i<Workers.length; i++) {
    var start = toDate( ('' + Workers[i].startVacation));
    var end = toDate(('' + Workers[i].EndVacation));
    var days = (end - start)/1000/3600/24;

    if (((currentDate - start) > 0) && ((end - currentDate)>0) && (Workers[i].addDays == "none")) {
        Workers[i].addDays = "not";
    }
    if (((currentDate - start) > 0) && ((end - currentDate)>0) && (Workers[i].addDays == "not")) {

        Workers[i].summVacationDays += days;
        Workers[i].addDays = "yes";

        console.log(Workers[i].summVacationDays);
        
        var NewStorage = Workers;
        localStorage.clear();
        var strWorkers = JSON.stringify(NewStorage);
        localStorage.setItem("key", strWorkers);

        window.location.reload();
    }
    if (currentDate > end) {
        Workers[i].addDays = "none";
    }
    /* обновляем!! */
}

function toDate(date) {
    
    var dot = date.indexOf(".");
    var thisdate = +date.substring(0, dot);
    var thismonth= +date.substring(dot+1) -1;
    var resDate = new Date(currentDate.getFullYear(), thismonth, thisdate);
    return resDate;
}

function ColorClass(date, startVacation, EndVacation) {

    var start = toDate(startVacation);
    var end = toDate(EndVacation);
    
    if(date - end > 0) {
        return 'yellow';
    }
    else if(start - date > 0) {
        return 'green';
    } else {
        return 'blue';
    }
}

function nameSort(array) {
    array.sort(function(a,b){
        if (a.fullName > b.fullName) {
            return 1;
        }
        if (a.fullName < b.fullName) {
            return -1;
        }
        return 0;
    })
    return array;
}
function dateSort(array) {
    
    array.sort(function(a,b){
        function toNumbers (string) {
            var dot = string.indexOf(".");
            var thisdate = +string.substring(0, dot);
            var thismonth= +string.substring(dot+1) -1;
            return [thismonth, thisdate];
        }
        var elem1 = toNumbers(a.startVacation);
        var elem2 = toNumbers(b.startVacation);

        if (elem1[0] > elem2[0]) {
            return 1;
        }
        if (elem1[0] < elem2[0]) {
            return -1;
        }
        if (elem1[1] > elem2[1]) {
            return 1;
        }
        if (elem1[1] < elem2[1]) {
            return -1;
        }
        var newArray = [a, b];
        var newSort = nameSort(newArray);
        if (newArray[0] == newSort[0]) { 
            return -1;
        }
        if (newArray[0] != newSort[0]) {
            return 1;
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

        var color = ColorClass(currentDate, Workers[i].startVacation, Workers[i].EndVacation);
        var WorkerInfo ='<tr>';
        WorkerInfo += '<td>' + Workers[i].fullName + '</td>';
        WorkerInfo += '<td>' + Workers[i].Qualification + '</td>'
        WorkerInfo += '<td ' + 'class="' + color + '" >' + Workers[i].startVacation + '</td>'
        WorkerInfo += '<td ' + 'class="' + color + '" >' + Workers[i].EndVacation + '</td>'
        WorkerInfo += '</tr>';
        var insertInfo = $('.calendar tbody').append(WorkerInfo);
    }
}
function reload(time) {
    setTimeout(function() {

        var NewStorage = Workers;
            localStorage.clear();
            var strWorkers = JSON.stringify(NewStorage);
            localStorage.setItem("key", strWorkers);
        window.location.reload();}, time);
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

function findId(string) {
    var id;
    for (var i=0; i<Workers.length; i++) {
        if (Workers[i].fullName == string) {
            id = Workers[i].id;
        }
    }
    var res = id || false;
    return res;
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
    $(".vacation-form" ).toggle();
});

$(".delete-vacation").on("click", function(){
    $(".delete-form").toggle();
});

$("body").on("submit",".delete-form", function() {
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();

    var nameJoin = checkName(name);
    var isFind = findId(nameJoin);
    if (isFind) {
        var number;
        for (var i=0; i<Workers.length; i++) {
            if (Workers[i].id == isFind) {
                number = i;
            }
        }
        var start = toDate(Workers[number].startVacation);
        if (start > currentDate) {
            Workers[number].startVacation = '';
            Workers[number].EndVacation = '';

            var NewStorage = Workers;
            localStorage.clear();
            var strWorkers = JSON.stringify(NewStorage);
            localStorage.setItem("key", strWorkers);
            window.location.reload();
        } else {
            alert("можно удалить только будущий отпуск");
        }
    }
});

$("body").on("submit",".vacation-form", function() {
    
    var thisForm = $(this);
    var name = (thisForm).children().children('#name').val();
    var startVacation = (thisForm).children().children('#start-vacation').val();
    var endVacation = (thisForm).children().children('#end-vacation').val();

    var nameJoin = checkName(name);

    startVacation = encodeURIComponent(startVacation);
    endVacation = encodeURIComponent(endVacation);

    var isFind = findId(nameJoin);
    if (isFind) {
        var number;
        var worker;
        for (var i=0; i<Workers.length; i++) {
            if (Workers[i].id == isFind) {
                worker = Workers[i];
                number = i;
            }
        }
        /* если currentdata фигурирует - обязательно обновляем*/
        var startStorageDay;
        var endStorageDay;
        if(worker.startVacation) {
            var startStorageDay = toDate(worker.startVacation); 
            var endStorageDay = toDate(worker.EndVacation); 
        }
        
        var startFormDay = toDate(startVacation);
        var endFormDay = toDate(endVacation);
        console.log(startFormDay);
        console.log(endFormDay);
        var days = (endFormDay - startFormDay)/1000/3600/24;

        function rewriteStorage1() {
            if ((currentDate - startFormDay) > 0) {
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
                if(((currentDate - endStorageDay) < 0) && ((currentDate - startStorageDay)>0)) { 
                    alert("вы не можете ставить новый отпуск во время существующего");
                    return false;
                }
                if(((endStorageDay - startStorageDay)>(startFormDay - endStorageDay))&& ((currentDate - endStorageDay) > 0)) { 
                    alert("минимальный период между периодами отпуска равен размеру первого отпуска");
                    return false;
                }
                return true;
            }
            return true;
        }
        function rewriteStorage2() {
            var notSameVacation = 0;
            var SameVacation = 1;
            for (var i=0; i<Workers.length; i++) {
                if ((worker.Qualification == Workers[i].Qualification)) {
                    notSameVacation++;
                    if((Workers[i].startVacation != "")&&(Workers[i].fullName != worker.fullName)) {
                        
                        var newStartDay = toDate(Workers[i].startVacation);
                        var newEndDay = toDate(Workers[i].EndVacation);

                        if ( ((startFormDay >= newStartDay) && (startFormDay < newEndDay)) || 
                            ((endFormDay > newStartDay) && (endFormDay < newEndDay)) ) { 
                            console.log(Workers[i]);
                            SameVacation++;
                        }
                    }
                }
            }
            if((notSameVacation/2) < SameVacation) {
                alert("в отпуске имеют право находиться не более 50% сотрудников одной должности");
                return false;
            }
            else {
                return true;
            }
        }
        console.log(worker.summVacationDays);
        var success1 = rewriteStorage1();
        var success2 = rewriteStorage2();

        if (success1 && success2) {
            
            Workers[number].startVacation = startVacation;
            Workers[number].EndVacation = endVacation;

            var NewStorage = Workers;
            localStorage.clear();
            var strWorkers = JSON.stringify(NewStorage);
            localStorage.setItem("key", strWorkers);

            window.location.reload();
            
        }      
    } else {
        alert("нет данного сотрудника, повторите попытку");
    }

    return false;
});