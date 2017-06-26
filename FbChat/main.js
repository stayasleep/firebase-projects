firebase.initializeApp(config);
var fbRef = firebase.database();

// document.addEventListener("DOMContentLoaded",ready);  //only works when JS file is in the html doc
window.addEventListener("load",ready);  //use this when 'importing' to other js file
function ready(){
    //var shorthand to access DOM elements
var userName = document.getElementById("username");
var msgInput = document.getElementById("message");
var submitBtn = document.getElementById("submit");
//apply event listerners
submitBtn.addEventListener("click",function(){
    var sentFrom = userName.value;
    var sentMsg = msgInput.value;
    //send it to firebase
    // Fb.set(sentFrom + ": "+sentMsg);
    var newMsgRef = fbRef.ref('messages').push();
    newMsgRef.set({
        "username":sentFrom,
        "message":sentMsg
    })
    msgInput.value="";
});
// startListening();
}   

// function startListening(){
    fbRef.ref('messages').on('value',function(snap){
        //listens when the value in db changes and updates the dom
        //save obj from db
        var msg = snap.val();
        console.log('this is your snap', msg);
        
        //obj comes back with unique id..have to go one level deeper
        document.getElementById("results").innerHTML=""; //reset the dom so we dont get doubles
        for(var x in msg){
            if(msg.hasOwnProperty(x)){
                console.log('close',msg[x]);
                var msgUsername = document.createElement("p");
                msgUsername.innerText = msg[x].username+": "+msg[x].message;

                // var msgText = document.createElement("p");
                // msgText.textContent = msg[x].message;

                // msgUsername.appendChild(msgText);

                var msgContainer = document.createElement("div");
                msgContainer.appendChild(msgUsername);
                // msgContainer.appendChild(msgText);

                //attach it to dom
                document.getElementById("results").appendChild(msgContainer);
            }
        }
    })
// }
