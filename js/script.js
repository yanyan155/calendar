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