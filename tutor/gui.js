
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

///////////////////////////////////////////////////////////////////////////////
// your code below
var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	"terminal" : terminal,
	"correctTheCode" : correctTheCode,
    "send" : send,
    "header" : header,
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




//----------------------------------------------------------------------------------------------------------------
//send button for textchat
function send1(){
    var text = document.getElementById("typeArea").innerHTML;
    if(text.length != 0){
        document.getElementById("chatArea").innerHTML += "<span style='padding: 3px; border-radius: 12px; float:right; border:4px solid #14cF6F; background-color: #98F5FF;color: blue'>" + text + "</span>" + "<br>" + "<br>";
        document.getElementById("typeArea").innerHTML = "";    
    }    
}


function send(response){
    if(response.value.length != 0){
        document.getElementById("chatArea").innerHTML += "<span style='padding: 3px; border-radius: 12px; float: left; border:4px solid #68c5cF; background-color: #54FF9F; color: green;text-align: left;'>" + response.value + "</span>" + "<br>" + "<br>";    
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
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; f = f * c"+"<span style='background-color: yellow'>"+"<LI>"+
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;printf(\"Factorial of %d = %d\\n\", n, f);<LI>"+
		"<br><LI>" + 
		"&nbsp;&nbsp;&nbsp;&nbsp;return 0;<LI>"+
		"}<LI>"+
		"<br><LI></OL>"+"<br>"+"<br>";
	}
}
//---------------------header------------------------------
//logout button for tutor
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
            document.getElementById("test").src = "https://res.cloudinary.com/teepublic/image/private/s--p4CRpWLH--/c_crop,x_10,y_10/c_fit,w_992/c_crop,g_north_west,h_972,w_1127,x_-68,y_-346/l_misc:transparent_1260/fl_layer_apply,g_north_west,x_-134,y_-488/c_mfit,g_north_east,u_misc:tapestry-l-l-gradient/e_displace,fl_layer_apply,x_0,y_19/l_upload:v1507037316:production:blanks:knoqtwkqk9vucfsy8ke0/fl_layer_apply,g_north_west,x_0,y_0/b_rgb:191919/c_limit,f_jpg,h_630,q_90,w_630/v1516770153/production/designs/2303889_0.jpg";
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
            location.href = "rating.html";
           /* document.getElementById("currentStudent").innerHTML = "Es sind 6 Personen in der Warteschlange";
            document.getElementById("next").src = "https://image.flaticon.com/icons/png/512/2403/premium/2403848.png";
            document.getElementById("msg").innerHTML = "get Next student";
            document.getElementById("nextButton").style.backgroundColor = "#336699";
            studentPresent = false;*/
        }
    }
}

function endScreen(){
    alert("please end screensharing first");
}

function getBackToGui(){
    location.href = "gui.html";
}

//wizard function to set content header for call button
//state 0 = do nothing
//state 1 = set phonecall active
//state 2 = deactivate phonecall
//state 3 = get student from queue
function header(response){
    var state = response.value;
    if(state == 0){
        //do nothing
    }else if(state == 1){
        document.getElementById("phone").src = "pics/redPhone.png";
        document.getElementById("phoneText").innerHTML = "hang up";
        document.getElementById("phoneButton").style.backgroundColor = "#457fb9";
        phoneBool = true;
    }else if(state == 2){
        document.getElementById("phone").src = "https://cdn4.iconfinder.com/data/icons/social-media-2097/94/phone-512.png";
        document.getElementById("phoneText").innerHTML = "call student";
        document.getElementById("phoneButton").style.backgroundColor = "#336699";
        phoneBool = false;
    }else if(state == 3){
        document.getElementById("currentStudent").innerHTML = "Es sind 34 Personen in der Warteschlange<br>Du bist mit User 2362 verbunden";
        document.getElementById("next").src = "pics/student.png";
        document.getElementById("msg").innerHTML = "end session";
        document.getElementById("nextButton").style.backgroundColor = "#457fb9";
        studentPresent = true;
    }
}


//--------------------- End Content-Header---------------------