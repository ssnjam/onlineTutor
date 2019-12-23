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

function paste(){
	document.getElementById("textbox").innerHTML = "" +
	"<br>" + "<OL><LI>" +
	"#include &lt;stdio.h&gt;<LI>" +
	"<br><LI>" +
	"int main()<LI>"+
	"{<LI>"+
	"&nbsp;&nbsp;&nbsp;&nbsp;int c, n, f = 1;<LI>" +
	"<br><LI>" +  
	"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Enter a number to calculate its factorial\\n\");<LI>" +
	"&nbsp;&nbsp;&nbsp;&nbsp;scanf(\"%d\", &n);<LI>" +
	"<br><LI>" + 
	"&nbsp;&nbsp;&nbsp;&nbsp;for (c = 1; c <= n; c++)<LI>" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; f = f * c"+"<span style='background-color: yellow'>"+"  ;  "+"</span>"+"<LI>"+
	"<br><LI>" + 
	"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Factorial of %d = %d\\n\", n, f);<LI>"+
	"<br><LI>" + 
	"&nbsp;&nbsp;&nbsp;&nbsp;return 0;<LI>"+
	"}<LI>"+
	"<br><LI></OL>"+"<br>"+"<br>"
}


var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    "animal" : updateAnimal,
    "showCounter" : showCounter,
    "counter" : updateCounter,
    "mytext" : updateText,
	"terminal" : terminal,
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

function terminal(response){
	var state = response.value;
	var terminalText = document.getElementById("terminalTextArea");
	if(state == 0){
		terminalText.innerHTML = "<span style='color: green; font-weight: bold;'>VM-15@hci:</span><span style='color: #a0a0a0'>_</span>" ;
	}else if(state == 1){
		terminalText.innerHTML = "<span style='color: #a0a0a0'>compiling ... <br>compiling complete <br></span><span style='color: green; font-weight: bold;'>VM-15@hci:</span><span style='color: #a0a0a0'>_</span>" ;
	}else if (state == 2){
		terminalText.innerHTML = "<span style='color: #a0a0a0'>Usage: make factorial<br></span><span style='color: green; font-weight: bold;'>VM-15@hci:</span><span style='color: #a0a0a0'>_</span>" ;
	}else if (state == -1){
		terminalText.innerHTML = "<span style='color:red'>compile error<br></span><span style='color: green; font-weight: bold;'>VM-15@hci:</span><span style='color: #a0a0a0'>_</span>" ;
	}
}



