firebase.initializeApp(config);
var fbRef = firebase.database();

// document.addEventListener("DOMContentLoaded",ready);  //only works when JS file is in the html doc
window.addEventListener("load",ready);  //use this when 'importing' to other js file
function ready(){
    document.getElementById("logout").style.display="none";
    document.getElementsByClassName("onlineContainer")[0].style.display="none";
    document.getElementsByClassName("chat")[0].style.display="none";
    makeModal();
    window.addEventListener("click",closeModal);
    window.addEventListener('click',closeEmojiMenu);
    document.getElementsByClassName("newReg")[0].addEventListener("click",userModal);
    document.getElementsByClassName("returning")[0].addEventListener("click",userModal);

    var username = null;
    var newLogin = document.querySelector('newLogin');
    var email = document.getElementById("email");
    var password=document.getElementById("password");
    var login = document.getElementById("login");
    var logout = document.getElementById("logout");
    var msgInput = document.getElementById("message");
    var submitBtn = document.getElementById("submit");

    submitBtn.style.display = "none";
    msgInput.style.display = "none";

    logout.addEventListener("click",function(){
        noLongerOnline();
        firebase.auth().signOut().then(function(){
            document.getElementById("results").innerHTML="";
            document.getElementsByClassName("chat")[0].style.display="none"
            msgInput.style.display ="none";
            submitBtn.style.display="none";
            document.getElementsByClassName("onlineContainer")[0].style.display="none";
            document.getElementById("logout").style.display="none";
            let logBtn=document.getElementsByClassName("returning")[0];
            logBtn.style.display="block";
            let signBtn = document.getElementsByClassName("newReg")[0];
            signBtn.style.display="block";

        },function(error){
            console.log("error");
        })
    })

    submitBtn.addEventListener("click",function(){
        // var sentFrom = userName.value; //only if we let them pick names
        var sentFrom = email.value;
        var sentMsg = msgInput.value;
        var date = new Date();
        var newMsgRef = fbRef.ref('messages').push();
        newMsgRef.set({
            "username":sentFrom,
            "date": date.toLocaleTimeString(),
            "message":sentMsg
        })
        msgInput.value="";
    });
    let emo = document.getElementsByClassName("emo")[0];
    emo.addEventListener("click",function(){
        let emojiMenu=document.getElementsByClassName("emojiMenu")[0];
        let emo = document.getElementsByClassName("emo")[0];
        if(emojiMenu.classList.contains("opened")){
            emojiMenu.style.display="none";
            emojiMenu.classList.remove("opened");
            emo.classList.remove("expand");
        }else{
            emojiMenu.style.display="block";
            emojiMenu.className+=" opened";
            emo.className+=" expand";
        }
    })
};

// function sendMsg(){
//     let sentFrom = document.getElementById("email");
//     var sentFrom = email.value;
//     var sentMsg = msgInput.value;
//     var date = new Date();
//     var newMsgRef = fbRef.ref('messages').push();
//     newMsgRef.set({
//         "username":sentFrom,
//         "date": date.toLocaleTimeString(),
//         "message":sentMsg
//     })
//     msgInput.value="";
// }
function startListening(){
    fbRef.ref('messages').on('value',function(snap){
        //listens when the value in db changes and updates the dom
        var msg = snap.val();
        console.log('this is your snap', msg);
        
        //obj comes back with unique id..have to go one level deeper
        document.getElementById("results").innerHTML=""; //reset the dom so we dont get doubles
        for(var x in msg){
            if(msg.hasOwnProperty(x)){
                console.log('close',msg[x]);
                var msgUsername = document.createElement("p");
                msgUsername.innerText = msg[x].username+" ("+msg[x].date+") "+ ": "+msg[x].message;

                var msgContainer = document.createElement("div");
                msgContainer.appendChild(msgUsername);

                //attach it to dom
                document.getElementById("results").appendChild(msgContainer);
                let element = document.getElementById("results");
                element.scrollTop = element.scrollHeight;
            }
        }
    })
    whoIsOnline();
}
function makeModal(){
// function userModal(functionID){
    let modalFade = document.createElement("div");
    modalFade.className="modal fade";
    modalFade.id="userModal";
    modalFade.setAttribute("tabindex","-1");
    modalFade.style.display="none";

    let modalDialog = document.createElement("div");
    modalDialog.className="modal-dialog";
    modalDialog.setAttribute("role","document");

    let modalContent  = document.createElement("div");
    modalContent.className="modal-content";
    let modalHeader = document.createElement("div");
    modalHeader.className="modal-header";

    let modalTitle =document.createElement("h5");
    modalTitle.className="modal-title";
    modalTitle.innerText="Enter Info Below";

    let button = document.createElement("button");
    button.className="close";
    button.setAttribute("data-dismiss","modal");
    button.setAttribute("aria-label","Close");
    button.addEventListener("click",function(){
        modalFade.classList.remove("show");
        modalFade.style.display="none";
    })

    let spanClose = document.createElement("span");
    spanClose.setAttribute("aria-hidden","true");
    spanClose.innerHTML="&times;";

    let modalBody = document.createElement("div");
    modalBody.className="modal-body form-group";

    let emailInput = document.createElement("input");
    emailInput.id="email";
    emailInput.className="form-control"
    emailInput.setAttribute("type","email");
    emailInput.setAttribute("placeholder","Enter Email");

    let passInput = document.createElement("input");
    passInput.id="password";
    passInput.className="form-control"
    passInput.setAttribute("type","password");
    passInput.setAttribute("placeholder","Enter a password");

    let modalFooter = document.createElement("div");
    modalFooter.className="modal-footer";

    let btnSubmit = document.createElement("button");
    btnSubmit.setAttribute("type","button");
    btnSubmit.className="formSub btn btn-primary";
    // btnSubmit.id=functionID;
    btnSubmit.setAttribute("data-dismiss","modal");
    btnSubmit.innerHTML="Submit";
    btnSubmit.addEventListener('click',function(){
        modalFade.classList.remove("show");
        modalFade.style.display="none";
    })

    let btnCancel = document.createElement("button");
    btnCancel.setAttribute("type","button");
    btnCancel.className = "closeModal btn btn-secondary";
    btnCancel.setAttribute("data-dismiss","modal");
    btnCancel.innerText="Close";
    btnCancel.addEventListener("click",function(){
        modalFade.classList.remove("show");
        modalFade.style.display="none";
    })

    modalFooter.appendChild(btnSubmit);
    modalFooter.appendChild(btnCancel);
    modalBody.appendChild(emailInput);
    modalBody.appendChild(passInput);
    button.appendChild(spanClose);
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(button);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modalFade.appendChild(modalDialog);

    document.getElementsByTagName('body')[0].appendChild(modalFade); 
}
function userModal(){
    let userStat = event.target.attributes[1].value;
    console.log('ev',event.target.attributes[1].value); //this will allow one modal, several buttons, interchangeable content
    document.getElementsByClassName("formSub")[0].id=userStat;
    document.getElementById(userStat).addEventListener('click',function(){
        if(userStat==="newLogin"){
            signUp();
        }else{
            returningUser();
        }

    });
    let modal=document.getElementById("userModal");
    modal.className+=" show";
    modal.style.display="block";
    modal.style.backgroundColor="rgba(0,0,0,0.4)";
    let emailInput = document.getElementById("email").focus();

}
function closeModal(event){
    let modal = document.getElementById("userModal");
    if(event.target === modal){
        modal.style.display="none";
        modal.classList.remove("show");
    }
}
function closeEmojiMenu(event){
    console.log('emoji opened',event);
    let emojiMenu = document.getElementsByClassName("emojiMenu")[0];
    let emoji=document.getElementsByClassName("emoji")[0];
    let emo =document.getElementsByClassName("emo")[0];
    if(emo.classList.contains("expand") && !event.target.classList.contains("emojiMenu") && !event.target.classList.contains("emoContainer") && !event.target.classList.contains("emo")){
            emojiMenu.style.display="none";
            emojiMenu.classList.remove("opened");
            emo.classList.remove("expand");
    }
    // if(emojiMenu.style.display === "block" && event.target!==emoji){
    //     emojiMenu.style.display="none";
    // }
}

function signUp(){
    var emails=document.getElementById("email").value;
    var passwords=document.getElementById("password").value;
    
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
            addUsersOnline(username);
            newLogin.disabled = true;

            let logBtn=document.getElementsByClassName("returning")[0];
            logBtn.style.display="none";
            let signBtn = document.getElementsByClassName("newReg")[0];
            signBtn.style.display="none";

            document.getElementsByClassName("onlineContainer")[0].style.display="block";
            document.getElementsByClassName("chat")[0].style.display="block";

            submitBtn.style.display = "block";
            msgInput.style.display = "block";
            document.getElementById("logout").style.display="block";
            startListening();
        }
    });
}
function returningUser(){
        var emails=email.value;
        var passwords=password.value;
        var msgInput = document.getElementById("message");
        var submitBtn = document.getElementById("submit");
        firebase.auth().signInWithEmailAndPassword(emails, passwords)
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
         firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // After creating account, you are automatically logged in from FB and this is where magic should happen
                username=user.email;
                addUsersOnline(username);
                let logBtn=document.getElementsByClassName("returning")[0];
                logBtn.style.display="none";
                let signBtn = document.getElementsByClassName("newReg")[0];
                signBtn.style.display="none";

                document.getElementsByClassName("onlineContainer")[0].style.display="block";
                document.getElementsByClassName("chat")[0].style.display="block";
                submitBtn.style.display = "block";
                msgInput.style.display = "block";
                document.getElementById("logout").style.display="block";
                startListening();
            }
        });
}

function addUsersOnline(name){
    let newMsgRef = fbRef.ref('active').push();
    newMsgRef.set({
        username: name
    });
};

function whoIsOnline(){
    fbRef.ref('active').on('value',function(snap){
        let list = snap.val();
        document.getElementsByClassName("online")[0].innerHTML="";
        for(let j in list){
            if(list.hasOwnProperty(j)){
                let activeUser = document.createElement("P");
                activeUser.textContent = list[j].username;
                activeUser.setAttribute("data-uid",j);
                
                // let activeContainer = document.createElement("div");
                document.getElementsByClassName("online")[0].appendChild(activeUser);
            }
        }
    })
}

function noLongerOnline(){
    let userList = document.getElementsByClassName("online")[0].childNodes;
    for(var i = 0;i<userList.length;i++){
        if(userList[i].textContent === firebase.auth().currentUser.email){
            let removed = firebase.auth().currentUser.email;
            let attr = userList[i].getAttribute("data-uid");
            fbRef.ref('active/'+attr).set(null);
        }
    }
}