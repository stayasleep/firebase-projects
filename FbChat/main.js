firebase.initializeApp(config);
var fbRef = firebase.database();

// document.addEventListener("DOMContentLoaded",ready);  //only works when JS file is in the html doc
window.addEventListener("load",ready);  //use this when 'importing' to other js file
function ready(){
    var username = null;
    var loginButton = document.querySelector('#login');
    var email = document.getElementById("email");
    var password=document.getElementById("password");
    // var userName = document.getElementById("username"); dont need if we are tryign oauth
    var msgInput = document.getElementById("message");
    var submitBtn = document.getElementById("submit");

    submitBtn.style.display = "none";
    msgInput.style.display = "none";
    //event listerner got login
    loginButton.addEventListener("click",function(){
        // firebase.auth().signInWithEmailAndPassword(email, password)
        //     .catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //     if (errorCode === 'auth/wrong-password') {
        //         alert('Wrong password.');
        //     } else {
        //         alert(errorMessage);
        //     }
        //     console.log(error);
        // });
        var emails=email.value;
        var passwords=password.value;
        firebase.auth().createUserWithEmailAndPassword(emails,passwords)
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('hello',user.email);
                // After creating account, you are automatically logged in from FB and this is where magic should happen
                username=user.email;
                loginButton.textContent="Logged in as "+username;
                loginButton.disabled = true;
                submitBtn.style.display = "block";
                msgInput.style.display = "block";
                startListening();
            }
        });
    })
    //apply event listerners
    submitBtn.addEventListener("click",function(){
        // var sentFrom = userName.value; //only if we let them pick names
        var sentFrom = username;
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
};
function startListening(){
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
}
