/**
 * @file Feedback.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */

// backbone for the feedback page
    var fbFeedback = firebase.database().ref("Feedback/");
    var num = 0;
    fbFeedback.once("value")
    .then(function(snapshot){
        snapshot.forEach(function(childSnapshot1){
            var id = childSnapshot1.key;
            match_id(id,fbFeedback);
       });
    });

/**
* @function match_id
* @description verifys whether the user in is a CNA or patient/family member
*/
function match_id(id,fbFeedback){

    if (id.charAt(0) == "3"){
        var fbCNA = firebase.database().ref("CNA/"+id+"/Portfolio");
        let arr_name = [];
        var name;
        var picture;
        fbCNA.once("value")
           .then(function(snapshot){
               var name;
               var picture;
               snapshot.forEach(function(childSnapshot1){
                   if(childSnapshot1.key == "Name"){
                       name = childSnapshot1.val();
                   }
                   if(childSnapshot1.key =="pictureurl"){
                       picture = childSnapshot1.val();
                       tableform(id,name,fbFeedback,picture);
                   }
               })
           });
    }
    else{
        var fbPAT = firebase.database().ref("Patient/"+id+"/Portfolio");
        let arr_name = [];
        var name;
        fbPAT.once("value")
           .then(function(snapshot){
               var name;
               var picture;
               snapshot.forEach(function(childSnapshot1){
                   if(childSnapshot1.key == "Name"){
                       name = childSnapshot1.val();
                   }
                   if(childSnapshot1.key =="pictureurl"){
                       picture = childSnapshot1.val();
                       tableform(id,name,fbFeedback,picture);
                   }
               })
           });
    }

}
var index = 0;

function submitFeedBack(id, fbFeedback){
//firebase.database().ref("CenterInformation/ContactInfo/Aboutus").set(text);
//var fbReply = firebase.database().ref("Feedback/"+id+"/Center"+"/"+lastDate+"/"+feedbackID+"/Replied/");


}
function myFunction(id,fbFeedback) {
  var x = document.getElementById("myText").value;
  document.getElementById("demo").innerHTML = x;
  firebase.database("Feedback/"+id).ref().set({id: x});
}

/**
* @function openmenu
* @description allows user to open the menu that switches languages and logout (?)
*/
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

/**
* @function profile
* @description gets the profile information of current user
*/
function profile(){
  document.getElementById("profile").style.display = "block";
}

/**
* @function closeprofile
* @description allows the user to close the profile information
*/
function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

/**
* @function editprofile
* @description allows the user to edit their basic profile information
*/
function editprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "block";
}

/**
* @function cancelprofile
* @description allows the user to cancel out of editing their information
*/
function cancelprofile(){
  window.location.reload()
}

/**
* @function submitprofile
* @description allows the user to submit the edits to their profile
* not completed, but not getting rid of until next sprint
*/
function submitprofile(){

}

//gets the current time and stores in a variable
var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();

var time = hour+":"+minute+":"+second;
