//Login page contents
var logincontact= firebase.database().ref("CenterInformation/ContactInfo/")
logincontact.once('value')
.then(function(snapshot){
snapshot.forEach(function(childSnapshot){
  var childKey = childSnapshot.key;
  var childData = childSnapshot.val();
  if (childSnapshot.key == "Aboutus"){
  }
  if (childSnapshot.key == "Name"){
    document.getElementById('contactname').innerHTML=childSnapshot.val();
  }
  if (childSnapshot.key == "Email"){
    document.getElementById('contactemail').innerHTML=childSnapshot.val();
  }
  if (childSnapshot.key == "Contact No"){
    document.getElementById('contactno').innerHTML=childSnapshot.val();
  }
  if (childSnapshot.key == "Address"){
    document.getElementById('contactaddress').innerHTML=childSnapshot.val();
  }
});
});

//Login event
function LoginUser(){
  var txtEmail = document.getElementById('txtEmail');
  var txtPassword = document.getElementById('txtPassword');
  var email = txtEmail.value;
  console.log(txtEmail.value);
  var pass = txtPassword.value;
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(function(error){
    alert("信箱或密碼錯誤！！");
  });
}

//For checking whether you're loggedin or Loggedout
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser){
    console.log(firebaseUser);
    if(firebaseUser.email == "ltctmsapp2018@gmail.com"){
      alert('你已管理員身份登入!');
      window.location.href = "Backend/Policy.html"

    }else{
      var today = new Date();
      var currentYear = today.getFullYear();
      var currentMonth = today.getMonth()+1;
      var currentDay = today.getDate();

      var currentHour = today.getHours();
      var currentMinute = today.getMinutes();
      var currentSecond = today.getSeconds();

      if(currentHour < 10){
        currentHour = '0' + currentHour
      }
      if(currentMinute < 10){
        currentMinute = '0' + currentMinute
      }
      if(currentSecond < 10){
        currentSecond = '0' + currentSecond
      }

      var fullDate = currentYear+'-'+currentMonth+'-'+currentDay;
      var fullTime = currentHour+':'+currentMinute+':'+currentSecond;
      var fullDateandTime = fullDate +'-'+ fullTime;

      firebase.database().ref('AccountStatus/Browser/'+firebaseUser.uid+'/LoginHistory/'+fullDate+'/'+ fullTime).set('True');
      firebase.database().ref('AccountStatus/Browser/'+firebaseUser.uid+'/LatestLogin').set(fullDateandTime);
      document.getElementById('policyPop').style.display='block';

    }
  }
  else {
    console.log('請登入！');
  }
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {

      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

function bigqr(x) {
    x.style.height = "100px";
    x.style.width = "100px";
}

function normalqr(x) {
    x.style.height = "16px";
    x.style.width = "16px";
}

function forgetPass(){
  var getEmail = document.getElementById('forgetP').value;
  var position = document.getElementById('fposition').value;
  var id = document.getElementById('fid').value;

  var fbF = firebase.database().ref('uAccount');
  fbF.child(id).once("value", function(snapshot){
    if(snapshot.exists()){
        if(snapshot.child('Email').val() == getEmail){
          if(position == "Director of Nursing" || position == "Director" || position == "DIR"){
            sendEmail(id,getEmail);
          }else if(position == "Chief Nursing Officer" || position == "CNO"){
            sendEmail(id,getEmail);
          }else{
            alert("職位不存在！");
          }
        }else{
          alert("電子信箱不存在！");
        }
    }else{
      if(id == ''){
        alert("請輸入你的識別碼");
      }else{
          alert("識別碼不存在!");
      }

    }
  });
}

function sendEmail(id,getEmail){
  firebase.auth().sendPasswordResetEmail(getEmail).then(function(){
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth()+1;
    var currentDay = today.getDate();

    var currentHour = today.getHours();
    var currentMinute = today.getMinutes();
    var currentSecond = today.getSeconds();

    if(currentHour < 10){
      currentHour = '0' + currentHour
      }
    if(currentMinute < 10){
      currentMinute = '0' + currentMinute
    }
    if(currentSecond < 10){
      currentSecond = '0' + currentSecond
    }

    var fullDate = currentYear+'-'+currentMonth+'-'+currentDay;
    var fullTime = currentHour+':'+currentMinute+':'+currentSecond;
    var fullDateandTime = fullDate +'-'+ fullTime;

    firebase.database().ref('AccountStatus/Browser/'+ id +'/ChangePasswordHistory/'+fullDateandTime).set('請確認你的郵件來更改密碼');
    alert("請確認你的郵件來更改密碼!");
    window.location.reload();
    }).catch(function(error){
    alert("電子信箱不存在");
    });
}

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

var fbPolicy = firebase.database().ref('Policy/P1').child('System Policy');
fbPolicy.once('value', function(snapshot){
  var url = snapshot.val();
  document.getElementById('policyid').src = url;
})

function policyPopup(){
  alert('你已成功登入!');
  window.location.href = "Frontend/01Aboutus2.html";
}

function policyPopupClose(){
  firebase.auth().signOut();
  alert("你無法登入，除非你充分了解隱私政策");
  window.location.reload();
}
