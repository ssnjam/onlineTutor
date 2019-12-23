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

//is false, if there is no current phone connection
var phoneBool = false;

function setPhonePic(){
    if(phoneBool == false){
        document.getElementById("phone").src = "pics/redPhone.png";
        document.getElementById("phoneText").innerHTML = "hang up";
        document.getElementById("phoneButton").style.backgroundColor = "#457fb9";
        phoneBool = true;
    }else{
        document.getElementById("phone").src = "https://cdn4.iconfinder.com/data/icons/social-media-2097/94/phone-512.png";
        document.getElementById("phoneText").innerHTML = "call tutor";
        document.getElementById("phoneButton").style.backgroundColor = "#336699";
        phoneBool = false;
    }   
}

//is false, if there is no screensharing
var screenBool = false;

function setScreenPic(){
    if(screenBool == false){
        document.getElementById("screen").src = "pics/endScreen.png";
        document.getElementById("screenText").innerHTML = "end screensharing";
        document.getElementById("screenButton").style.backgroundColor = "#457fb9";
        screenBool = true;
    }else{
        document.getElementById("screen").src = "https://cdn2.iconfinder.com/data/icons/pittogrammi/142/03-512.png";
        document.getElementById("screenText").innerHTML = "screensharing";
        document.getElementById("screenButton").style.backgroundColor = "#336699";
        screenBool = false;
    }
}


