
var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    // console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    // console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            console.log("not found: " + request.responseText);
        }
    }
};

function get(variable) {
    // console.log("get " + variable);
    request.open("GET", dburl + variable, false);
    request.send();
}

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        get(name);
    }
}

// request updates at a fixed interval (ms)
var intervalID = setInterval(update, 1000);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    "animal" : updateAnimal,
    "showCounter" : showCounter,
    "counter" : updateCounter,
    "mytext" : updateText,
    // add further handlers here
};

function updateAnimal(response) {
    document.getElementById(response._id).src = response.src;
    document.getElementById(response._id).width = response.width;
}

function updateCounter(response) {
    document.getElementById(response._id).innerHTML =
        showCounter ? response.value : "";
}

var showCounter = true;

function showCounter(response) {
    showCounter = response.checked;
}

function updateText(response) {
    document.getElementById("mytext").innerHTML = response.value;
}
//---------------------header------------------------------

function logout(){
    var sure = confirm("Are you sure you want to logout?");
    if(sure == true){
        location.href = "login.html";
    }
}

//--------------------- Start Content-Header---------------------
var studentPresent = false;

//is false, if there is no current phone connection
var phoneBool = false;

function setPhonePic(){
    if(studentPresent == true){
        if(phoneBool == false){
            document.getElementById("phone").src = "pics/redPhone.png";
            document.getElementById("phoneText").innerHTML = "hang up";
            document.getElementById("phoneButton").style.backgroundColor = "#457fb9";
            phoneBool = true;
        }else{
            document.getElementById("phone").src = "https://cdn4.iconfinder.com/data/icons/social-media-2097/94/phone-512.png";
            document.getElementById("phoneText").innerHTML = "call student";
            document.getElementById("phoneButton").style.backgroundColor = "#336699";
            phoneBool = false;
        } 
    }else{
        alert("You need to get a student from queue first.");
    }  
}

//additional function only used while screensharing
function setPhonePic2(){
    if(phoneBool == false){
        document.getElementById("phone").src = "pics/redPhone.png";
        document.getElementById("phoneText").innerHTML = "hang up";
        document.getElementById("phoneButton").style.backgroundColor = "#457fb9";
        phoneBool = true;
    }else{
        document.getElementById("phone").src = "https://cdn4.iconfinder.com/data/icons/social-media-2097/94/phone-512.png";
        document.getElementById("phoneText").innerHTML = "call student";
        document.getElementById("phoneButton").style.backgroundColor = "#336699";
        phoneBool = false;
    } 
}

function startScreenshare(){
    if(studentPresent == true){
        location.href = "gui2.html";
    }else{
        alert("You need to get a student from queue first.");
    }
}

//user has to confirm to move on to next student
function confirmAction(){
    if(studentPresent == false){
        document.getElementById("currentStudent").innerHTML = "Es sind 34 Personen in der Warteschlange<br>Du bist mit User 2362 verbunden";
        document.getElementById("next").src = "pics/student.png";
        document.getElementById("msg").innerHTML = "end session";
        document.getElementById("nextButton").style.backgroundColor = "#457fb9";
        studentPresent = true;
    }else{
        var action = confirm("Are you sure you want to end the session with the student?");
        if(action == true){
            document.getElementById("currentStudent").innerHTML = "Es sind 6 Personen in der Warteschlange";
            document.getElementById("next").src = "https://image.flaticon.com/icons/png/512/2403/premium/2403848.png";
            document.getElementById("msg").innerHTML = "get Next student";
            document.getElementById("nextButton").style.backgroundColor = "#336699";
            studentPresent = false;
        }
    }
}

function endScreen(){
    alert("please end screensharing first");
}

function getBackToGui(){
    location.href = "gui.html";
}

//--------------------- End Content-Header---------------------