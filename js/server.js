var currentDate = moment();
var ChangeCount = 0;

function reload(time) { 
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
function findWorker(string) {
    var find = false;
    var worker;
    var number;
    for (var i=0; i<Workers.length; i++) {
        if (Workers[i].fullName == string) {
            worker = Workers[i];
            number = i;
            find = true;
        }
    }
    if (find) {
        return [number , worker];
    }
    return false;
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
if( !(localStorage.getItem("key"))) {
    var strWorkers = JSON.stringify(storage);
    localStorage.setItem("key", strWorkers);
}
//localStorage.clear();
var Workers = JSON.parse(localStorage.getItem("key"));
var currentDate = moment();

for (var i = 0; i<Workers.length; i++) {

    var worker = Workers[i];
    var start = moment(worker.startVacation, "DD.MM.YY");
    var end = moment(worker.endVacation, "DD.MM.YY");
    var days = end.diff(start, "days") + 1;

    if (!worker.lastVacation[0] && start.isValid() && (currentDate.isAfter(end))) {
        worker.lastVacation = [ worker.startVacation , worker.endVacation];
        ChangeCount++;
    }
    if (worker.addDays === "firstSumm" && (worker.summVacationDays === 0) && end.isValid()/*(worker.endVacation != "")*/) {
        worker.summVacationDays += days; 
        ChangeCount++;
    }

    if(currentDate.isAfter(start) && end.isAfter(currentDate) && (worker.addDays == "none")) {
        worker.addDays = "not";
    }
    if(currentDate.isAfter(start) && end.isAfter(currentDate) && (worker.addDays == "not")) {
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
function serverDeleteVacation(formdata) {
    var name = formdata.name;
    var nameJoin = checkName(name);
    var find = findWorker(nameJoin);
    if (find) { 
        var number = find[0]; 
        var worker = find[1]; 

        var start = moment(worker.startVacation, "DD.MM.YY");
        if (start.isAfter(currentDate)) {
            worker.startVacation = worker.lastVacation[0] || '';
            worker.endVacation = worker.lastVacation[1] || '';

            ChangeStorage();
            window.location.reload();
        } else {
            alert("можно удалить только будущий отпуск");
        }
    } else {
        alert("нет данного сотрудника, повторите попытку");
    }
};

function serverEditVacation(formdata) { 
    console.log(formdata);
    var name = formdata.name;
    var startVacation = formdata.startVacation;
    var endVacation = formdata.endVacation;

    var nameJoin = checkName(name);
    var find = findWorker(nameJoin);

    function dateCheck (start, end) {
        var start = moment(start, "DD.MM.YY");
        var end = moment(end, "DD.MM.YY");
        if (start.isValid() && end.isValid()) {
            return true;
        }
        return false;
    }
    var dateCheck = dateCheck(startVacation, endVacation);
    if (!dateCheck) { 
        alert("данные не верны")
        return false;
    }
    if (find) { 
        var number = find[0]; 
        var worker = find[1]; 

        var startStorageDay;
        var endStorageDay;
        if(worker.startVacation) {
            var startStorageDay = moment(worker.startVacation, "DD.MM.YY"); 
            var endStorageDay = moment(worker.endVacation, "DD.MM.YY");
        }

        var startFormDay = moment(startVacation, "DD.MM.YY");
        var endFormDay = moment(endVacation, "DD.MM.YY");
        console.log(startFormDay);
        console.log(endFormDay);
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
                
                if(((endStorageDay.diff(startStorageDay, "days") - startFormDay.diff(endStorageDay, "days"))>0)&& 
                    (currentDate.isAfter(endStorageDay))) { 

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

                        var newStartDay = moment(Workers[i].startVacation, "DD.MM.YY");
                        var newEndDay = moment(Workers[i].endVacation, "DD.MM.YY");

                        if ( ((startFormDay.isAfter(newStartDay) || startFormDay.isSame(newStartDay)) &&
                            (startFormDay.isBefore(newEndDay) || startFormDay.isSame(newEndDay))) ||   
                            ((endFormDay.isAfter(newStartDay) || endFormDay.isSame(newStartDay)) && // 2
                            (endFormDay.isBefore(newEndDay) || endFormDay.isSame(newEndDay))) ||   
                            ((startFormDay.isBefore(newStartDay) || startFormDay.isSame(newStartDay)) &&  // 3
                            (endFormDay.isAfter(newEndDay) || endFormDay.isSame(newEndDay))) ) {
                            
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
        console.log(success1);
        console.log(success2);
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
    }
};
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
function Sorting(elem1, elem2) {
    if (elem1 > elem2) {
        return 1;
    }
    if (elem1 < elem2) {
        return -1;
    }
    return 0;
}
function nameSort(data) {
    data.sort(function(a,b){
        return Sorting(a.fullName, b.fullName);
    })
    return data;
}
function dateSort(data) { 
    data.sort(function(a,b){
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
    return data;
}
(function( $ ){

  $.fn.addTable = function( data, sortingType ) { 

    if(sortingType === 'name') {
         data = nameSort(data);
    }
    if(sortingType === 'date') {
         data = dateSort(data);
    }
    var calendar = $(".calendar");
    if (calendar) {
        calendar.remove();
    } 
    var WorkerInfo = "";
    for (var i=0; i<data.length; i++) {

        var color = ColorClass(currentDate, data[i].startVacation, data[i].endVacation);
        WorkerInfo +='<tr>';
        WorkerInfo += '<td>' + data[i].fullName + '</td>';
        WorkerInfo += '<td>' + data[i].Qualification + '</td>';
        WorkerInfo += '<td ' + 'class="' + color + '" >' + data[i].startVacation + '</td>';
        WorkerInfo += '<td ' + 'class="' + color + '" >' + data[i].endVacation + '</td>';
        WorkerInfo += '</tr>';
    }
    var table = "<table class=\"calendar\">";
        table += "<tbody><tr><td>фамилия имя сотрудника</td>";
        table += "<td>должность</td>";
        table += "<td>дата начала отпуска</td>";
        table += "<td>дата окончания отпуска</td>";
        table += "</tr>" + WorkerInfo +  "</tbody></table>";

    return this.prepend(table);
  };
})( jQuery );

$("body").addTable(Workers, 'date');
reload(1000*3600*12);
$(".date-sort").on("click", function(){
    $("body").addTable(Workers, 'date');
});

$(".name-sort").on("click", function(){
    $("body").addTable(Workers, 'name');
});