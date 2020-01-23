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
	"terminal" : terminal,
	"correctTheCode" : correctTheCode,
    "send" : send,
    "popUpWindows"  : popUpWindows,
    // add further handlers here
};



//--------------------------------------------------------------------------------------------------------------
// terminal functions
// state 0: terminal starting line
// state 2: giving tipp / usage
// state 1: compiling
// state -1: error code
// state -2: not whitelisted
// state 3: allowing typing
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
	}else if (state == -2){
		terminalText.innerHTML = "<span style='color:red'>your code was not whitelisted yet<br></span><span style='color: green; font-weight: bold;'>VM-15@hci:</span><span style='color: #a0a0a0'>_</span>" ;
	}
}



//--------------------------------------------------------------------------------------------------------------
// paste of faulty code - > pastebutton above the textbox
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
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; f = f * c"+"<LI>"+
	"<br><LI>" + 
	"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Factorial of %d = %d\\n\", n, f);<LI>"+
	"<br><LI>" + 
	"&nbsp;&nbsp;&nbsp;&nbsp;return 0;<LI>"+
	"}<LI>"+
	"<br><LI></OL>"+"<br>"+"<br>"
}

//----------------------------------------------------------------------------------------------------------------
	//send button for textchat
function send1(){
    var text = document.getElementById("typeArea").innerHTML;
    if(text.length != 0){
        document.getElementById("chatArea").innerHTML += "<span style='padding: 3px; border-radius: 12px; float:right; border:4px solid #68c5cF; background-color: #98F5FF;color: blue'>" + text + "</span>" + "<br>" + "<br>";
        document.getElementById("typeArea").innerHTML = "";    
    }    
}


function send(response){
    if(response.value.length != 0){
        document.getElementById("chatArea").innerHTML += "<span style='padding: 3px; border-radius: 12px; float: left; border:4px solid #14cF6F; background-color: #54FF9F; color: green;text-align: left;'>" + response.value + "</span>" + "<br>" + "<br>";    
    }
}




//--------------------------------------------------------------------------------------------------------------
//Content-Header
//is false, if there is no current phone connection
var phoneBool = false;

function setPhonePic(){
    if(phoneBool == false){
        document.getElementById("phone").src = "pics/orangePhone.gif";
        document.getElementById("chatArea").innerHTML += "calling...<br>";
        setTimeout(function(){ document.getElementById("chatArea").innerHTML += "call accepted<br>";document.getElementById("phone").src = "pics/redPhone.png";
        document.getElementById("phoneText").innerHTML = "hang up";
        document.getElementById("phoneButton").style.backgroundColor = "#457fb9"; }, 4000);
        
        
        phoneBool = true;
    }else{
        document.getElementById("phone").src = "https://cdn4.iconfinder.com/data/icons/social-media-2097/94/phone-512.png";
        document.getElementById("chatArea").innerHTML += "call ended<br>";
        document.getElementById("phoneText").innerHTML = "call tutor";
        document.getElementById("phoneButton").style.backgroundColor = "#336699";
        phoneBool = false;
    }   
}

//is false, if there is no screensharing
var screenBool = false;

function setScreenPic(){
    if(screenBool == false){
        document.getElementById("screen").src = "pics/callScreen.gif";
        document.getElementById("chatArea").innerHTML += "screensharing...<br>";
        setTimeout(function(){ document.getElementById("chatArea").innerHTML += "screenshare accepted<br>";
        
        
        
        document.getElementById("screen").src = "pics/endScreen.png";
        document.getElementById("screenText").innerHTML = "end screensharing";
        document.getElementById("screenButton").style.backgroundColor = "#457fb9";
        document.getElementById("vid").src= "pics/test.gif";}, 4000);
        screenBool = true;
    }else{
        document.getElementById("chatArea").innerHTML += "screenshare ended<br>";
        document.getElementById("screen").src = "https://cdn2.iconfinder.com/data/icons/pittogrammi/142/03-512.png";
        document.getElementById("screenText").innerHTML = "screensharing";
        document.getElementById("screenButton").style.backgroundColor = "#336699";
        document.getElementById("vid").src = "";
        screenBool = false;
    }
}

//user has to confirm to leave page
function confirmAction(){
	var action = confirm("Are you sure you want to leave the page? For a new tutor you will have to wait in the queue again!");
	if(action == true){
		location.href = "starRating.html";
	}
}


//----------------------------------------------------------------------------------------------------------------
//functionality to correct the pasted code
// state -1 given by WoZ is doing nothing so the tutant can type
// state 0 give first correction
// state 1 give full correction
function correctTheCode(response){
	var state = response.value;
	if(state == -1){
		//do nothing
	}else if(state == 0){
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
		"&nbsp;&nbsp;&nbsp;&nbsp;for (c = 1; c <= n; c++)"+"<LI>"+
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; f = f * c"+"<span style='background-color: yellow'>"+"  ;  "+"</span>"+"<LI>"+
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Factorial of %d = %d\\n\", n, f);<LI>"+
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;return 0;<LI>"+
		"}<LI>"+
		"<br><LI></OL>"+"<br>"+"<br>";
	}else if(state == 1){	
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
		"&nbsp;&nbsp;&nbsp;&nbsp;for (c = 1; c <= n; c++)"+"<span style='background-color: yellow'>"+"  {  "+"</span>"+"<LI>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; f = f * c"+"<span style='background-color: yellow'>"+"  ;  "+"</span>"+"<LI>"+
		"<span style='background-color: yellow'>"+"&nbsp;&nbsp;&nbsp;&nbsp;"+"}<LI>  "+"</span>" +
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Factorial of %d = %d\\n\", n, f);<LI>"+
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;return 0;<LI>"+
		"}<LI>"+
		"<br><LI></OL>"+"<br>"+"<br>";
	}
}

function popUpWindows(response){
	var state = response.value;
    if(state == 1){
        if (confirm('A call is incoming')) {
            // Save it!
        } else {
            // Do nothing!
        }
        
        
        
    }else if(state == 2){
        
    }
    
}

