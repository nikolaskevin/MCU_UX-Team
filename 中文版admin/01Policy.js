firebase.auth().onAuthStateChanged(function (firebaseUser){
if(firebaseUser){
  console.log(firebaseUser);
  var userid = firebaseUser.uid;
  var displayName = firebaseUser.displayName;
  console.log(displayName);
  console.log(userid);
}else{
  alert("你已登出系統，請再重新登入一次!");
  window.location.href = "/Users/tungchen/Documents/GitHub/shared-LTC-TMS/LTCTMS/中文版Chinese version/C_00Login2.html";
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
          alert("電子信箱已更換!");
        }).catch(function(error){
          console.log(error.message);
        });
      }
      user.updateProfile({
        displayName:name
      }).then(function(){
        alert("個人檔案已上傳!");
      }).catch(function(error){
        console.log('個人檔案上傳失敗'+ error.message);
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
            alert('成功地更改密碼!');
            window.location.reload();
          }).catch(function(error){
            alert(error.message);
          });
        }).catch(function(error) {
          alert('重新認證失敗!');
        });
  }else{
    alert("密碼無法匹配!")
  }

}
