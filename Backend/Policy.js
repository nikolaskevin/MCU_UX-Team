firebase.auth().onAuthStateChanged(function (firebaseUser){
if(firebaseUser){
  console.log(firebaseUser);
  var userid = firebaseUser.uid;
  var displayName = firebaseUser.displayName;
  console.log(displayName);
  console.log(userid);
}else{
  alert("You're Logged out now! Please Login again if you need to use this system!");
  window.location.href = "../Frontend/00Login2.html";
}
});

function Logout(){
  firebase.auth().signOut();
}

var storageRef = firebase.storage().ref('Policy/policy.html');
  storageRef.getDownloadURL().then(function (url) {
  firebase.database().ref("Policy/P1/System Policy/").set(url);
  document.getElementById("policy").src=url
});

function openmenu(){
  if(document.getElementById("menu").style.display== "block"){
    document.getElementById("menu").style.display = "none";
    document.getElementById("openmenu").style.opacity = "1";
  }
  else{
  document.getElementById("menu").style.display = "block";
  document.getElementById("openmenu").style.opacity = ".6";
}
}



function profile(){
  document.getElementById("profile").style.display = "block";
  displayProfile();
}

function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

function editprofile(){
  document.getElementById("editprofile").style.display = "block";
  document.getElementById('nameProfileE').value = document.getElementById('nameProfile').innerHTML;
  document.getElementById('idProfileE').innerHTML= document.getElementById('idProfile').innerHTML;
  document.getElementById('emailProfileE').value = document.getElementById('emailProfile').innerHTML;
  document.getElementById("profile").style.display = "none";
}

function cancelprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
  document.getElementById("changePass").style.display = "none";
}

function submitprofile(){
  var name=document.getElementById('nameProfileE').value;
  var id =document.getElementById('idProfileE').value;
  var email=document.getElementById('emailProfileE').value;
  var contact=document.getElementById('contactProfileE').value;
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      if(user.email != email){
        user.updateEmail(email).then(function(){
          alert("Email Changed!");
        }).catch(function(error){
          console.log(error.message);
        });
      }
      user.updateProfile({
        displayName:name
      }).then(function(){
        alert("Profile have been updated!");
      }).catch(function(error){
        console.log('Profile update Failed'+ error.message);
      });
    }
  });
}


var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();

var time = hour+":"+minute+":"+second;
 console.log(time);


function displayProfile(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var name = user.displayName;
      var id = user.uid;
      var email= user.email;;

      document.getElementById('nameProfile').innerHTML=name;
      document.getElementById('idProfile').innerHTML=id;
      document.getElementById('emailProfile').innerHTML=email;
    }
  });
}

function changePassword(){
  document.getElementById("changePass").style.display="block";

}

function submitNewPass(){
  var newPass= document.getElementById('newPassword').value;
  var cnewPass=document.getElementById('confirmnewPassword').value;
  var oldPass = document.getElementById('oldPassword').value;
  if (newPass==cnewPass){
      var user = firebase.auth().currentUser;
        var credentials = firebase.auth.EmailAuthProvider.credential(
          user.email,
          oldPass);
        user.reauthenticateAndRetrieveDataWithCredential(credentials)
        .then(function() {
          user.updatePassword(newPass)
          .then(function(){
            firebase.database()
            alert('Successfully Re-New Password!');
            window.location.reload();
          }).catch(function(error){
            alert(error.message);
          });
        }).catch(function(error) {
          alert('Failed to reauthenticate!');
        });
  }else{
    alert("Your Password are not match!")
  }

}
