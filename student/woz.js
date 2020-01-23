var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            var json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                createDB();
            } else {
                var url = request.responseURL
//              console.log(typeof(url));
                var i = url.lastIndexOf("/", url.length - 1);
                var name = url.substring(i + 1);
                handlers[name]({ "_id" : name });
            }
        }
    }
};

function getCheckedRadio(name) {
    var options = document.getElementsByName(name);
    for (i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, false);
    request.send();
}

function put(response, message) {
    console.log("put::response = " + response);
    console.log("put::message = " + message);
    request.open("PUT", dburl + response._id, false);
    request.setRequestHeader("Content-type", "application/json");
    message["_id"] = response._id;
    if (response._rev) {
        message["_rev"] = response._rev;
    }
    var s = JSON.stringify(message);
//  console.log("put: " + s);
    request.send(s);
}

function createDB() {
    request.open("PUT", dburl, false);
    request.send();
}

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	"terminal" : terminal,
	"correctTheCode" : correctTheCode,
    "send" : send,
    "popupCall"  : popupCall,
    // add further handlers here
};

function terminal(response) {
	var value = getCheckedRadio("terminalState");
//  console.log("mytext::value = " + value);
    put(response, {"value" : value});
}

function correctTheCode(response){
	var value = getCheckedRadio("correctTheCode");
//  console.log("mytext::value = " + value);
    put(response, {"value" : value});
}

//----------------------------------------------------------------------------------------------------------------
	//send button for textchat
function send(response){
    var value = document.getElementById("contentForSync").value;
    document.getElementById("contentForSync").value = ""; 
    put(response, {"value" : value});
}


function popupCall(response){
	var value = getCheckedRadio("popupCall");
//  console.log("mytext::value = " + value);
    put(response, {"value" : value});
}

function createCall(response){
    put(response, {"value" : "nothing"});
}

function createScreen(response){
    put(response, {"value" : "nothing"});
}
