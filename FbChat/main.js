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
    document.getElementsByClassName("newReg")[0].addEventListener("click",userModal);
    // document.getElementsByClassName("popUp")[0].addEventListener("click",userModal("login"));
    // document.getElementsByClassName("newReg")[0].addEventListener("click",userModal("newLogin"));
    var username = null;
    var newLogin = document.querySelector('#newLogin');
    var email = document.getElementById("email");
    var password=document.getElementById("password");
    var login = document.getElementById("login");
    var logout = document.getElementById("logout");
    // var userName = document.getElementById("username"); dont need if we are tryign oauth
    var msgInput = document.getElementById("message");
    var submitBtn = document.getElementById("submit");

    submitBtn.style.display = "none";
    msgInput.style.display = "none";

    //test
    // newLogin.addEventListener("click",signUp);
    // login.addEventListener("click",returningUser);

    logout.addEventListener("click",function(){
        noLongerOnline();
        firebase.auth().signOut().then(function(){
            document.getElementById("results").innerHTML="";
            document.getElementsByClassName("chat")[0].style.display="none"
            msgInput.style.display ="none";
            submitBtn.style.display="none";
            document.getElementsByClassName("onlineContainer")[0].style.display="none";
            document.getElementById("logout").style.display="none";
        },function(error){
            console.log("error");
        })
    })
    // event listerner got login
    login.addEventListener("click",function(){
        var emails=email.value;
        var passwords=password.value;
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

                login.textContent="Logged in as "+username;
                login.disabled = true;
                document.getElementsByClassName("onlineContainer")[0].style.display="block";
                document.getElementsByClassName("chat")[0].style.display="block";
                submitBtn.style.display = "block";
                msgInput.style.display = "block";
                document.getElementById("logout").style.display="block";
                startListening();
            }
        });
        
    })
    newLogin.addEventListener("click",function(){
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
                newLogin.textContent="Logged in as "+username;
                newLogin.disabled = true;
                document.getElementsByClassName("onlineContainer")[0].style.display="block";
                document.getElementsByClassName("chat")[0].style.display="block";
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
        var date = new Date();
        var newMsgRef = fbRef.ref('messages').push();
        newMsgRef.set({
            "username":sentFrom,
            "date": date.toLocaleTimeString(),
            "message":sentMsg
        })
        msgInput.value="";
    });
};
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

    let btnCancel = document.createElement("button");
    btnCancel.setAttribute("type","button");
    btnCancel.className = "closeModal btn btn-secondary";
    btnCancel.setAttribute("data-dismiss","modal");
    btnCancel.innerText="Close";
    btnCancel.addEventListener("click",function(){
        modalFade.classList.remove("show");
        modalFade.style.display="none";
        // modalFade.classList.remove("modal-backdrop");
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
// function userModal(functionID){
//     console.log("who clicked me",functionID);
//     // let userModal = document.getElementById("userModal");
//     // document.getElementsByTagName('body')[0].appendChild(userModal);

//     // document.getElementsByClassName("formSub")[0].id=functionID;
//     // document.getElementById(functionID).addEventListener("click",)

//     // let modal=document.getElementById('userModal')
//     // modal.className+=' show';
//     // modal.style.display="block";
// }
// function signUp(){
//     //  newLogin.addEventListener("click",function(){
//         var emails=document.getElementById("email").value;
//         var passwords=document.getElementById("password").value;
        
//         firebase.auth().createUserWithEmailAndPassword(emails,passwords)
//             .catch(function(error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             if (errorCode == 'auth/weak-password') {
//                 alert('The password is too weak.');
//             } else {
//                 alert(errorMessage);
//             }
//             console.log(error);
//         });
//         firebase.auth().onAuthStateChanged(function(user) {
//             if (user) {
//                 console.log('hello',user.email);
//                 // After creating account, you are automatically logged in from FB and this is where magic should happen
//                 username=user.email;
//                 newLogin.textContent="Logged in as "+username;
//                 newLogin.disabled = true;
//                 submitBtn.style.display = "block";
//                 msgInput.style.display = "block";
//                 startListening();
//             }
//         });
//     // })
// }
// function returningUser(){
// // login.addEventListener("click",function(){
//         var emails=email.value;
//         var passwords=password.value;
//         firebase.auth().signInWithEmailAndPassword(emails, passwords)
//             .catch(function(error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             if (errorCode === 'auth/wrong-password') {
//                 alert('Wrong password.');
//             } else {
//                 alert(errorMessage);
//             }
//             console.log(error);
//         });
//         firebase.auth().onAuthStateChanged(function(user) {
//             if (user) {
//                 console.log('hello',user.email);
//                 // After creating account, you are automatically logged in from FB and this is where magic should happen
//                 username=user.email;
//                 login.textContent="Logged in as "+username;
//                 login.disabled = true;
//                 submitBtn.style.display = "block";
//                 msgInput.style.display = "block";
//                 startListening();
//             }
//         });
//     // })
// }

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