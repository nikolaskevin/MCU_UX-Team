/**
 * @file AdminProfile.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */

// contact firebase to varify and display admin information and 

firebase.auth().onAuthStateChanged(function (firebaseUser){
if(firebaseUser){
  console.log(firebaseUser);
  var userid = firebaseUser.uid;
  var displayName = firebaseUser.displayName;
  var pic = firebaseUser.photoURL;
  console.log(pic);
  var fbP = firebase.database().ref('uAccount/'+userid).child('Position');
  fbP.once('value',function(snapshot){
    var position = snapshot.val();
    document.getElementById('displayProfilename').innerHTML=displayName;
    document.getElementById('displayProfileid').innerHTML=userid;
    document.getElementById('displayProfileposition').innerHTML=position;
    document.getElementById('Profilepic').src=pic;
    document.getElementById('viewpic').src=pic;
    document.getElementById('editpic').src=pic;
    Profilepic.setAttribute('value',pic);
  });
}else{
  alert("You're Logged out now! Please Login again if you need to use this system!");
  window.location.href = "/../Frontend-Chinese/00Login2.html";
}
});
//console.log(document.getElementById('Profilepic').value);

/**
* @function profile
* @description gets the profile information of current user
*/
function profile(){
  document.getElementById("profile").style.display = "block";
  displayProfile();
}

/**
* @function closeprofile
* @description closes the profile page
*/
function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

/**
* @function eidtprofile
* @description allows the admin to make updates to their profile by changing their name,
*               ID, email, etc.
*/
function editprofile(){
  document.getElementById("editprofile").style.display = "block";
  document.getElementById('nameProfileE').value = document.getElementById('nameProfile').innerHTML;
  document.getElementById('idProfileE').innerHTML= document.getElementById('idProfile').innerHTML;
  document.getElementById('emailProfileE').value = document.getElementById('emailProfile').innerHTML;
  document.getElementById('nameProfileTE').innerHTML = document.getElementById('nameProfileT').innerHTML;
  document.getElementById('positionProfileE').innerHTML = document.getElementById('positionProfile').innerHTML;
  document.getElementById("profile").style.display = "none";
}

/**
* @function cancelprofile
* @description allows the admin to leave the portfolio of whoever they are looking at
*/
function cancelprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
  document.getElementById("changePass").style.display = "none";
}

/**
* @function submitprofile
* @description allows the admin to make a new portfolio for a new user
*/
function submitprofile(){
  var name=document.getElementById('nameProfileE').value;
  var id =document.getElementById('idProfileE').innerHTML;
  var email=document.getElementById('emailProfileE').value;
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
        window.location.reload();
      }).catch(function(error){
        console.log('Profile update Failed'+ error.message);
      });
    }
  });
}

/**
* @function displayProfile
* @description displays a user profile
*/
function displayProfile(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      var name = user.displayName;
      var id = user.uid;
      var email= user.email;;
      var position = document.getElementById('displayProfileposition').innerHTML;
      document.getElementById('nameProfile').innerHTML=name;
      document.getElementById('nameProfileT').innerHTML=name;
      document.getElementById('idProfile').innerHTML=id;
      document.getElementById('emailProfile').innerHTML=email;
      document.getElementById('positionProfile').innerHTML=position;

    }
  });
}

/**
* @function changePassword
* @description allows the change of a password
*/
function changePassword(){
  document.getElementById("changePass").style.display="block";

}

/**
* @function submitNewPass
* @description takes care of the process of verifying the new password
*/
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

//gets the current time and stores in a variable
var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();

/** 
 * puts a 0 infront of the numbers so that it can match the way 
 * the way military time is written
 */ 
if(hour < 10){
  hour = '0' + hour
}
if(minute < 10){
  minute = '0' + minute
}
if(second < 10){
  second = '0' + second
}

var time123 = hour+":"+minute+":"+second;
 console.log(time123);

 // Determines what time of day it is so they can display the correct greeting
window.onload=function(){

    if(time123<"12:00:00" && time123>="04:00:00"){
    document.getElementById("time123").innerHTML = "Good Morning &nbsp ";
  }
  if(time123>="12:00:00" && time123<"18:00:00"){
  document.getElementById("time123").innerHTML = "Good Afternoon &nbsp ";
}
  if(time123>="18:00:00" || time123<"04:00:00"){
document.getElementById("time123").innerHTML = "Good Evening &nbsp ";
}
}

/**
* @function Logout
* @description allows the user to log out of the site
*/ 
function Logout(){

  firebase.auth().signOut();
  console.log('logout');

}

/**
* @function uploadPicProfile
* @description allows the user to upload a profile picture and
*               alerts them if something went wrong
*/
function uploadPicProfile(){
  var file = $('#newPic').get(0).files[0];
  var id = document.getElementById('displayProfileid').innerHTML
  var storageRefProfile =firebase.storage().ref('Profile/'+id+'/'+file.name);
  storageRefProfile.put(file).on('state_changed',
      function(){

      },function error(err){
        console.log(err.message);
      },
      function complete(){
        storageRefProfile.getDownloadURL().then(function(url){
          var user = firebase.auth().currentUser;
          console.log("==="+user.displayName);
          user.updateProfile({
            photoURL: url
          }).then(function(){
            alert('Successfully Renew the Profile Picture!');
            window.location.reload();
          }).catch(function(err){
            alert('Failed to Renew! Error:'+ err.message);
          });
        });
      });


}

/**
* @function bigImg
* @description displays the profile picture in a bigger format
*               if clicked on
*/
function bigImg(x) {
    photoword.style.display = "inline";
    Profilepic.style.position = "relative"
    $("#Profilepic").css({ top: '-44px' });
    $("#photoword").css("z-index", "2000");
    $("#Profilepic").css("filter", "grayscale(100%)");
    $("#Profilepic").css("filter", "blur(2px)");

}

/**
* @function normalImg
* @description displays the profile picture in a thumbnail size
*/
function normalImg(x) {
    photoword.style.display = "none";
    Profilepic.style.display = "inline";
    Profilepic.style.position = "relative"
    $("#Profilepic").css({ top: '0px' });
    $("#Profilepic").css("filter", "grayscale(0%)");

}
