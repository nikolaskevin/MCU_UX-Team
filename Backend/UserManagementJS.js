/**
 * @file UserManagementJS.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */
//var admin = require("../node_modules/firebase-admin");
/**
* @function newAccount
* @description allows the admin to make a new account
*/
function newAccount(){
  var name = document.getElementById('Name').value;
  var email = document.getElementById('Email').value;
  var pass = document.getElementById('password').value;
  var position = document.getElementById('position').value;
  var lastCNOID
  var lastDirID
  var rec = firebase.database().ref('UID/LastCNOID');
  var rec2 = firebase.database().ref('UID/LastDirID');
  var ref = firebase.database().ref('UID').child('LastCNOID');
  var ref2 = firebase.database().ref('UID').child('LastDirID');
  rec.once('value').then(function(snapshot){
    lastCNOID = snapshot.val();//contains lastCNOID
    sendLastCNOID = lastCNOID;  
})
rec2.once('value').then(function(snapshot){  
    lastDirID = snapshot.val();//contains lastDirID
    sendLastDirID = lastDirID;
})
var n = email.search(/[*+?^${}();|→TH:]/g);

if(name == '' || email == '' || pass == '' || position == ''){
    alert('Please fill in all the information!');
  }
  else if(pass.length < 6){
    alert("Password length should over than six digits!");
}
else if(n != "-1"){
    alert("Email format can't have / ,*+?^${}()|→ []");
}
else if(email.includes(".com") ==false){
    alert("Please use @xxxxx.com format!!");
}
  else{
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(authData){
        console.log("User created successfully with payload-", authData.user.uid);
        userID = authData.user.uid;
        if(position == "CNO"){
            var userInfo = {
                Name: name,
                Email: email,
                Password: pass,
                Position: position,
                StaffID: sendLastCNOID
            }
            var updates={}
        ref.transaction(function(data){
                // this increments lastCNOID, CANNOT start at 0
                if (data || (data != 0)){
                    data++;
                    return data;
                }    
                else{
                    console.log("Didn't work, GG");
                }
                //document.write(data);
                updates['No_Portfolio/' + position + '/' + sendLastCNOID] = userInfo;
            
            })//end transaction function
        updates['uAccount/' + sendLastCNOID] = userInfo;
        updates['UID/' + userID] = userInfo.StaffID;
        firebase.database().ref().update(updates);
        location.reload();
        }// end if
        else{
            var userInfo2 = {
                Name: name,
                Email: email,
                Password: pass,
                Position: position,
                StaffID: sendLastDirID
            }
            var updates2={}
            ref2.transaction(function(data){
                // this increments lastDirID, CANNOT start at 0
                if (data || (data != 0)){
                    data++;
                    return data;
                }    
                else{
                    console.log("Didn't work, GG");
                }
            })//end transaction function
            updates2['uAccount/' + sendLastDirID] = userInfo2;
            updates2['UID/' + userID] = userInfo2.StaffID;
            firebase.database().ref().update(updates2);
            location.reload();
        }// end third else
})//end firebase.auth()
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
  });//end .catch
}//end second else
}//end of newACcount

function areYouSure(){
  var yes = confirm('Are you sure?');
  return yes;
}

/**
* @function deleteUserAccount
* @description bring the pop up for when you hit the delete button
*/
function deleteUserAccount(i){
  var sid = document.getElementById('cellId['+i+']').innerHTML;
  var table = document.getElementById('UserListBody');
  var tr = table.getElementsByTagName("tr");
  var position = tr[i].cells[3].innerHTML;
  var fbACCD = firebase.database().ref('uAccount').child(sid);
  var fbABCD = firebase.database().ref('No_Portfolio/'+position).child(sid);
  var confirmation = confirm("Undoing is not available! Please make sure you would not need this account anymore!");
  if(confirmation == true){
    fbACCD.remove();
    fbABCD.remove();
    alert("successfully removed the account!");
    location.reload();
  }
}

/**
* @function editUserAccount
* @description shows the information already for the user in the popup
* @param {*} i 
*/
function editUserAccount(i){
  var sid = document.getElementById('cellId['+i+']').innerHTML;
  var fbACCE= firebase.database().ref('uAccount').child(sid);
  fbACCE.on('value', function(snapshot){
    document.getElementById('editAccountPop').style.display = 'block';
    var childData = snapshot.val();
    //var sid = childData.StaffID;
    var name = childData.Name;
    var email = childData.Email;
    var position = childData.Position;
    var pass = childData.Password;

    document.getElementById('SIDE').innerHTML = sid;
    document.getElementById('NameE').value = name;
    document.getElementById('EmailE').value = email;
    document.getElementById('positionE').innerHTML = position;
    document.getElementById('passE').value = pass;

  });


}

/**
* @function editedUserAccount
* @description this is where the admin submits the edited data,
*               checks to see if the information is correct/ already exists
*/
function editedUserAccount(){
  var sid = document.getElementById('SIDE').innerHTML;
  var name= document.getElementById('NameE').value;
  var email= document.getElementById('EmailE').value;
  var position= document.getElementById('positionE').innerHTML;
  var pass= document.getElementById('passE').value;
  //var currPassword = firebase.database().ref('uAccount/' + sid + '/' + 'Password');
  var userAccount = firebase.database().ref("uAccount/");
  
  userAccount.child(sid).once('value').then(function(snapshot){
          var n = email.search(/[*+?^${}();|→TH:]/g);
          for(var i = 0; i <sid.length;i++){
              console.log(sid.charCodeAt(i));
              if((sid.charCodeAt(i) <=57 && sid.charCodeAt(i) >=48 ) == false){
                  var boolean = "false";
              }
          }
        if(name == '' || email == '' || pass == '' || position == ''){
          alert('Please fill in all the information!');
        }
        else if(boolean == "false"){
            alert("ID should be number!");
        }
        else if(pass.length < 6){
            alert("Password length should over than six digits!");
        }
        else if(n != "-1"){
            alert("Email format can't have / ,*+?^${}()|→ []");
        }
  
        else if(email.includes(".com") ==false){
            alert("Please use @xxxxx.com format!!");
        }
        else{
                var data = {
                 Name : name,
                 Email: email,
                 Password : pass,
                Position : position,
                StaffID : sid
                }
                var updates={}
                var updates1 ={}
                updates['uAccount/'+ sid]=data;
                updates['No_Portfolio/'+position+'/'+sid] =data;
                firebase.database().ref().update(updates);
                //currPassword.updatePassword(pass);
                location.reload();
      }
  });
  }
function updatePassword(){

}


//Display UM table - UID, NAME, STATUS, EDIT button, DELETE button
var rowIndex=0;
var fbACC = firebase.database().ref('uAccount');

/**
* @function tableNewRow
* @description adds a new row to the User Management table
*/
function tableNewRow(fb){
  var tablelist =document.getElementById('UserListBody');
  console.log(tablelist);
  fbACC.once('value', function(snapshot){
    snapshot.forEach(function(childSnapshot){
        var keyID = childSnapshot.key;
        console.log('=====');
          var sid = keyID;
          var email = childSnapshot.child('Email').val();
          var name = childSnapshot.child('Name').val();
          var position = childSnapshot.child('Position').val();
          //Requried For Later Version
          //var signIn = childSnapshot.child('AuthenticationData/metadata/lastSignInTime').val();

          var row = tablelist.insertRow(rowIndex);
          row.setAttribute("class","table-list-row");
          var cellSID = row.insertCell(0);
          var cellEmail = row.insertCell(1);
          var cellName = row.insertCell(2);
          var cellRole = row.insertCell(3);
          var cellEditBut = row.insertCell(4);
          var cellDeleteBut = row.insertCell(5);

          var buttonE = document.createElement('button');
          var buttonD = document.createElement('button');

          cellSID.appendChild(document.createTextNode(sid));
          cellEmail.appendChild(document.createTextNode(email));
          cellName.appendChild(document.createTextNode(name));
          cellRole.appendChild(document.createTextNode(position));
          cellEditBut.appendChild(buttonE);
          cellDeleteBut.appendChild(buttonD);

          cellSID.setAttribute('id','cellId['+rowIndex+']');
          buttonE.innerHTML ='Edit';
          buttonD.innerHTML ='Delete';
          buttonE.setAttribute('onclick','editUserAccount('+rowIndex+')');
          buttonD.setAttribute('onclick','deleteUserAccount('+rowIndex+')');

          rowIndex = rowIndex + 1;

    });

  });

}

/**
* @function showusermanagement
* @description 
*/
function showusermanagement(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("User Management").style.opacity = "1";
  document.getElementById("LoginTime").style.opacity = ".8";
  document.getElementById("LogoutTime").style.opacity = ".8";
}

/**
* @function showlogintime
* @description shows the login time of the browser and app accounts
*/
function showlogintime(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("User Management").style.opacity = ".8";
  document.getElementById("LoginTime").style.opacity = "1";
  document.getElementById("LogoutTime").style.opacity = ".8";
}

/**
* @function showlogouttime
* @description shows the logout time of the browser and app accounts
*/
function showlogouttime(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("User Management").style.opacity = ".8";
  document.getElementById("LoginTime").style.opacity = ".8";
  document.getElementById("LogoutTime").style.opacity = "1";
}

/**
* @function showchangepassword
* @description shows when a user has changed their passwrod to
*/
function showchangepassword(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("User Management").style.opacity = ".8";
  document.getElementById("LoginTime").style.opacity = ".8";
  document.getElementById("LogoutTime").style.opacity = ".8";
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

var fbStatus = firebase.database().ref('AccountStatus/Browser');
var rowIndex2 = 0;

/**
* @function tableBrowserLogging
* @description makes the table for the browser accounts table
*/
function tableBrowserLogging(fb){
  var tablelist =document.getElementById('browseraccountbody');
  fb.once("value",function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var id = childSnapshot.key;
      var latestLogin = childSnapshot.child('LatestLogin').val();
      var latestLogout = childSnapshot.child('LatestLogout').val();

      var row = tablelist.insertRow(rowIndex2);
      row.setAttribute("class","table-list-row");
      var cellID = row.insertCell(0);
      var cellLatestLogin = row.insertCell(1);
      var cellLatestLogout = row.insertCell(2);
      var cellViewBut = row.insertCell(3);

      var buttonV = document.createElement('button');


      cellID.appendChild(document.createTextNode(id));
      cellLatestLogin.appendChild(document.createTextNode(latestLogin));
      cellLatestLogout.appendChild(document.createTextNode(latestLogout));
      cellViewBut.appendChild(buttonV);

      cellID.setAttribute('id','cellId2['+rowIndex2+']');
      buttonV.innerHTML ='View';
      buttonV.setAttribute('onclick','historyBrowserLogging('+rowIndex2+')');

      rowIndex2 = rowIndex2 + 1;

    });
  });

}

/**
* @function closeHistory
* @description allows the admin to close out of the history menu
*/
function closeHistory(){
  document.getElementById('browsaccountname').style.display='none';
  document.getElementById('viewbacchistory').style.display='none';
  document.getElementById('appaccountname').style.display='none';
  document.getElementById('viewapphistory').style.display='none';

}

/**
* @function historyBrowserLogging
* @description allows the admin to open the history menu for browser users
*/
function historyBrowserLogging(n){
  var hisrow = 0;
  var hisrowout = 0;
  var rowP = 0;
  document.getElementById('browsaccountname').style.display='block';
  document.getElementById('viewbacchistory').style.display='block';
  document.getElementById('viewbrowserloginbody').innerHTML='';
  document.getElementById('viewbrowserlogoutbody').innerHTML='';
  document.getElementById('viewbrowserpasswordhistory').innerHTML='';
  document.getElementById('browsername').innerHTML = document.getElementById('cellId2['+n+']').innerHTML;
  var id = document.getElementById('browsername').innerHTML ;
  var fb = firebase.database().ref('AccountStatus/Browser/'+id);
  fb.once('value',function(snapshot){
    snapshot.forEach(function(logShot){
          if(logShot.key == 'LoginHistory'){
            logShot.forEach(function(loginShot){
              var date = loginShot.key;
              loginShot.forEach(function(loginShot2){
                var time = loginShot2.key;
                var dateandtime = date + '-' + time;
                var tablelogin = document.getElementById('viewbrowserloginbody');
                //table for login
                var rowLogin = tablelogin.insertRow(hisrow);
                var cellHistory = rowLogin.insertCell(0);
                cellHistory.appendChild(document.createTextNode(dateandtime));
                hisrow = hisrow + 1;
              });
            });
          }
          if(logShot.key == 'LogoutHistory'){
            logShot.forEach(function(logoutShot){
              var date = logoutShot.key;
              logoutShot.forEach(function(logoutShot2){
                var time = logoutShot2.key;
                var dateandtime2 = date + '-' + time;
                var tablelogout = document.getElementById('viewbrowserlogoutbody');
                //table in
                var rowLogout = tablelogout.insertRow(hisrowout);
                var cellHistory2 = rowLogout.insertCell(0);
                cellHistory2.appendChild(document.createTextNode(dateandtime2));
                hisrowout = hisrowout + 1;
              });
            });
          }
          if(logShot.key == 'ChangePasswordHistory'){
            logShot.forEach(function(passShot){
              var datetime = passShot.key;
              var passwordChangeR = passShot.val();
              var tablePass= document.getElementById('viewbrowserpasswordhistory');
              //table in
              var rowPassC = tablePass.insertRow(rowP);
              var cellHistory3 = rowPassC.insertCell(0);
              var cellChangePass = rowPassC.insertCell(1);
              cellHistory3.appendChild(document.createTextNode(datetime));
              cellChangePass.appendChild(document.createTextNode(passwordChangeR));
              rowP = rowP + 1;

            });
          }
    });

  });

}

var fbStatus2 = firebase.database().ref('AccountStatus/App');
var rowIndex3 = 0;

/**
* @function tableAppLogging
* @description makes the table for the app account tab
*/
function tableAppLogging(fb){
  var tablelist =document.getElementById('appaccountbody');
  fb.once("value",function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var id = childSnapshot.key;
      var latestLogin = childSnapshot.child('LatestLogin').val();
      var latestLogout = childSnapshot.child('LatestLogout').val();

      var row = tablelist.insertRow(rowIndex3);
      row.setAttribute("class","table-list-row");
      var cellID = row.insertCell(0);
      var cellLatestLogin = row.insertCell(1);
      var cellLatestLogout = row.insertCell(2);
      var cellViewBut = row.insertCell(3);

      var buttonV = document.createElement('button');


      cellID.appendChild(document.createTextNode(id));
      cellLatestLogin.appendChild(document.createTextNode(latestLogin));
      cellLatestLogout.appendChild(document.createTextNode(latestLogout));
      cellViewBut.appendChild(buttonV);

      cellID.setAttribute('id','cellIdApp['+rowIndex3+']');
      buttonV.innerHTML ='View';
      buttonV.setAttribute('onclick','historyAppLogging('+rowIndex3+')');

      rowIndex3 = rowIndex3 + 1;

    });
  });

}

/**
* @function historyAppLogging
* @description allows the admin to open the history menu for app users
*/
function historyAppLogging(n){
  var rowin = 0;
  var rowout = 0;
  var rowPass = 0;
  document.getElementById('appaccountname').style.display='block';
  document.getElementById('viewapphistory').style.display='block';
  document.getElementById('viewapploginbody').innerHTML='';
  document.getElementById('viewapplogoutbody').innerHTML='';
  document.getElementById('viewapppasswordhistory').innerHTML='';
  document.getElementById('appname').innerHTML = document.getElementById('cellIdApp['+n+']').innerHTML;
  var id = document.getElementById('appname').innerHTML ;
  var fb = firebase.database().ref('AccountStatus/App/'+id);
  fb.once('value',function(snapshot){
    snapshot.forEach(function(logShot){
          if(logShot.key == 'LoginHistory'){
            logShot.forEach(function(loginShot){
              var date = loginShot.key;
              loginShot.forEach(function(loginShot2){
                var time = loginShot2.key;
                var dateandtime = date + '-' + time;
                var tablelogin = document.getElementById('viewapploginbody');
                //table for login
                var rowLogin = tablelogin.insertRow(rowin);
                var cellHistory = rowLogin.insertCell(0);
                cellHistory.appendChild(document.createTextNode(dateandtime));
                rowin = rowin + 1;
              });
            });
          }
          if(logShot.key == 'LogoutHistory'){
            logShot.forEach(function(logoutShot){
              var date = logoutShot.key;
              logoutShot.forEach(function(logoutShot2){
                var time = logoutShot2.key;
                var dateandtime2 = date + '-' + time;
                var tablelogout = document.getElementById('viewapplogoutbody');
                //table in
                var rowLogout = tablelogout.insertRow(rowout);
                var cellHistory2 = rowLogout.insertCell(0);
                cellHistory2.appendChild(document.createTextNode(dateandtime2));
                rowout = rowout + 1;
              });
            });
          }
          if(logShot.key == 'ChangePasswordHistory'){
            logShot.forEach(function(passShot){
              var datetime2 = passShot.key;
              var passwordChangeR2 = passShot.val();
              var tablePass2= document.getElementById('viewapppasswordhistory');
              //table in
              var rowPassC2 = tablePass2.insertRow(rowPass);
              var cellHistory3 = rowPassC2.insertCell(0);
              var cellChangePass2 = rowPassC2.insertCell(1);
              cellHistory3.appendChild(document.createTextNode(datetime2));
              cellChangePass2.appendChild(document.createTextNode(passwordChangeR2));
              rowPass = rowPass + 1;

            });
          }
    });

  });

}

/**
* @function sortDateandTime
* @description sorts the logins by time
*/
function sortDateandTime(n,m){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(n);
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i  = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[m];
      y = rows[i + 1].getElementsByTagName("TD")[m];
      if (dir == "asc") {
        //console.log(x);
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
          //onsole.log(x.innerHTML);
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
