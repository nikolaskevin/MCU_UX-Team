/**
 * @file Schedulejs.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */

 var btnLogout = document.getElementById('btnLogout')
/*btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location = 'Login.html';
});*/

/**
* @function AddNewA
* @description makes the creat new announcement button
*/
function AddNewA(){
    document.getElementById('newABlock').style.display ='block';
}//end AddNewA

//Read firebase Announcements
var an =[];
var fbA = firebase.database().ref('Announcements');
var Atable = document.getElementById('table')
var rowIndex = 1;

fbA.once('value',function(snapshot){
  snapshot.forEach(function(childSnapshot){
    an[rowIndex] = childSnapshot.key
    var childData = childSnapshot.val();
    var button = document.createElement("button");
    var button2 = document.createElement("button");
    button.innerHTML="Detail";
    button2.innerHTML="Delete";
    var row = Atable.insertRow(rowIndex);
    //var cellId = row.insertCell(0)
    var cellAnnouncement= row.insertCell(0);
    var cellButton= row.insertCell(1)
    var cellButton2= row.insertCell(2);
    //cellId.appendChild(document.createTextNode(childKey));
    cellAnnouncement.appendChild(document.createTextNode(childData.ATitleIOS));
    cellButton.appendChild(button);
    cellButton2.appendChild(button2);
    button.setAttribute("id","editA_id["+rowIndex+"]");
    button.setAttribute("onclick","editA("+rowIndex+")");
    button2.setAttribute("id","deleteA_id["+rowIndex+"]");
    button2.setAttribute("onclick","deleteA("+rowIndex+")");

    rowIndex = rowIndex + 1;

  });
});

/**
* @function createNewAnnouncement
* @description creates the new announcement data
*/
function createNewAnnouncement(){
  var data = $('#Announcement').val();
  var title1= $('#Atitle').val();
  var title2= 'xtsx'+title1+'xtex';
  var data2 = 'xasx' + data + 'xaex';
  var keyA = fbA.push().key;
  var AData = {
    a_id : keyA,
    ATitleAndroid: title2 ,
    ATitleIOS:title1 ,
    AnnouncementAndroid:data2,
    AnnouncementIOS: data
  }
  var updates = {};
  if(data == ""){
    alert(' Please input a data');
  }
  else {
  updates['Announcements/'+ keyA] = AData;
  firebase.database().ref().update(updates);
  alert('Successfully Entered');
  window.location.reload();
}
}// end createNewAnnouncement 

/**
* @function  deleteA
* @description deletes the announcement data
*/
function deleteA(rowIndex){
  var fbB= firebase.database().ref('Announcements');

  var Ukey = an[rowIndex];
  console.log(Ukey);
  var r = confirm("Are you sure you want to delete an announcement?");
    if (r == true) {
        fbB.child(Ukey).remove();
        alert("successfully deleted!");
        //window.location.reload();
    }
    else {
    }
}// end deleteA

/**
* @function editA
* @description allows viewing/editing of annoucements
*/
function editA(rowIndex){
  document.getElementById('editABlock').style.display ='block';
  var Ukey = an[rowIndex];
  var fbB= firebase.database().ref('Announcements/'+Ukey);
  fbB.on('value', function(snapshot){
    var EAdata = snapshot.child('AnnouncementIOS').val();
    var EAdata2 = snapshot.child('ATitleIOS').val();
    document.getElementById('Amsg').value = EAdata;
    document.getElementById('AEtitle2').value = EAdata2;
    document.getElementById('keyname').innerHTML = Ukey;
  });

}// end editA

/**
* @function editSave
* @description allows saving of the edits
*/
function editSave(rowIndex){
  var editedData = $("#Amsg").val();
  var editedData2 = 'xasx' + editedData + 'xaex';
  var akey = document.getElementById('keyname').innerHTML;
  console.log(akey);
  var title1= $('#AEtitle2').val();
  var title2= 'xtsx'+title1+'xtex';
  var wholeA ={
    ATitleIOS: title1,
    ATitleAndroid: title2 ,
    AnnouncementAndroid: editedData2,
    AnnouncementIOS: editedData,
    a_id: akey
};
if(editedData == ""){
  alert(' Please input a data');
}
else {
  var updates={};
  updates['Announcements/'+ akey] = wholeA;
  firebase.database().ref().update(updates);
  window.location.reload();
}
}// end editSave

/**
* @function btnpopUp
* @description allows the detail button to give a pop up window
*/
function btnpopUp(){
  document.getElementById('Esave').style.display = "inline";

}

/**
* @function AddNewCS
* @description the button for adding events
*/
function AddNewCS(){
document.getElementById('newCSBlock').style.display ='block';
}

//Create new Working Schedule - Upload folder into firebase
var uploader3 = document.getElementById('uploader3');
var fileButton3 = document.getElementById('fileButton3');
var submitfileButton3 = document.getElementById('btnSubmitCS');

fileButton3.addEventListener('change', handleuploadfile3);
submitfileButton3.addEventListener('click', handleuploadfileSubmit3);

let file3;

/**
* @function handleuploadfile3
* @description uploads the ___ file
*/
function handleuploadfile3(e) {
 file3=e.target.files[0];

}// end handleuploadfile3

/**
* @function handleuploadfileSubmit
* @description lets the user know if they enetered data or not
* @param e
*/
function handleuploadfileSubmit3(e) {
  if(file3 == undefined){
    alert ("Please enter data!")
  }// end handleuploadfileSubmit3
var storageRef=firebase.storage().ref('CenterSchedule/'+file3.name);
var uploadtask3 = storageRef.put(file3);

uploadtask3.on('state_changed',

/**
* @function progress
* @description shows the user the percentage of the upload
* @param snapshot
*/
  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader.value = percentage;
  },//end progress

/**
* @function error 
* @description lets the user know that this has failed with a message
* @param err
*/
  function error(err){
    console.log("failed");
  },// end error

/**
* @function complete
* @description lets the user know that the upload is complete with a message and
* and creates urls for the information 
*/
  function complete(){
    console.log('Successful');
     var postKey = firebase.database().ref('CenterSchedule/').push().key;
     var title = document.getElementById('fileTitle3').value;
     var title2 = 'xtsx' + title + 'xtex';
     storageRef.getDownloadURL().then(function(url){
       console.log("Success");
       console.log(url);
       var updates = {};
       var postData={
       url : url,
       id : postKey,
       titleAndroid : title2,
       titleIOS: title,
       filename: file3.name

     };
    // if(url == "" || title =="")
    //  alert ("Please input")
    //else {
     updates['CenterSchedule/' + postKey] = postData;
     firebase.database().ref().update(updates);
     alert ("Entered Succesfully");
     window.location.reload();
   //}
     });
  }// end complete
);
}// end handleuploadfileSubmit3

//Display CS table
var cs = [];
var rowIndexCS = 1;
var fbCS = firebase.database().ref('CenterSchedule')
var WStable = document.getElementById('CStable');

fbCS.once('value',function(snapshot){
snapshot.forEach(function(childSnapshot){
    cs[rowIndexCS] = childSnapshot.key;
  var childKey = childSnapshot.key;
  var childData = childSnapshot.val();
  var button = document.createElement("button");
  var button2 = document.createElement("button");
  button.innerHTML="Download";
  button2.innerHTML="Delete";


  var row = CStable.insertRow(rowIndexCS);
 // var cellId = row.insertCell(0)
  var cellCSTitle = row.insertCell(0);
  var cellButton = row.insertCell(1);
  var cellButton2 = row.insertCell(2);
  //cellId.appendChild(document.createTextNode(childKey));
  cellCSTitle.appendChild(document.createTextNode(childData.titleIOS));
  cellButton.appendChild(button);
  cellButton2.appendChild(button2);
  button.setAttribute("id","download_id["+rowIndexCS+"]");
  button.setAttribute("onclick","downloadCS("+rowIndexCS+")");
  button2.setAttribute("id","deleteCS_id["+rowIndexCS+"]");
  button2.setAttribute("onclick","deleteCS("+rowIndexCS+")");
console.log(rowIndexCS);
 // button.onclick = downloadCS;
  //button2.onclick = deleteCS;
  rowIndexCS = rowIndexCS + 1;

});
});

/**
* @function deleteCS
* @description allows for the deletion of a center schedule
*/
function deleteCS(rowIndexCS){
var fbCS= firebase.database().ref('CenterSchedule');
var Ukey = cs[rowIndexCS];
//var Ukey = $(this).closest('tr').children('td:first').text();
console.log(Ukey);
var r = confirm("Are you sure you want to delete a center schedule?");
if (r == true) {
    fbCS.child(Ukey+"/filename").once('value').
    then(function(snapshot){
        var storageRef=firebase.storage().ref();
        storageRef.child("CenterSchedule/"+snapshot.val()).delete().then(function(){
            fbCS.child(Ukey).remove();
            alert("successfully deleted!");
            window.location.reload();
        });
    });
}
else {
}
}// end deleteCS

//CS download
/**
* @function downloadCS
* @description allows for a user to download a center schedule
*/
function downloadCS(rowIndexCS){
var fbCS= firebase.database().ref('CenterSchedule');
var Ukey = cs[rowIndexCS];
console.log(rowIndexCS);
//var Ukey = $(this).closest('tr').children('td:first').text();
var url = fbCS.child(Ukey).child('url');
let downloadURL;
url.once("value").then(function(snapshot){
   downloadURL = snapshot.val();
  // console.log(downloadURL);
   window.open(downloadURL,'_blank') ;
});
}// end downloadCS

/**
* @function DownloadNewCS
* @description allows for the user to download a newer version of the center schedule
*/
function DownloadNewCS(){
var url= firebase.storage().ref('CenterSchedule/csnew.xlsx');
url.getDownloadURL().then(function(ur2) {
      window.location = ur2;
   });
   }//end DownloadNewCS

/**
* @function AddNewWS
* @description allows adding a new work schedule 
*/
function AddNewWS(){
document.getElementById('newWSBlock').style.display ='block';
}// end AddNewWS

//Create new Working Schedule - Upload folder into firebase
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
var submitfileButton = document.getElementById('btnSubmitWS')

fileButton.addEventListener('change', handleuploadfile);
submitfileButton.addEventListener('click', handleuploadfileSubmit);

let file;

/**
* @function handleuploadfile
* @description 
*/
function handleuploadfile(e) {
 file=e.target.files[0];
}

/**
* @function handleuploadfileSubmit
* @description 
*/
function handleuploadfileSubmit(e) {
  if(file == undefined){
    alert ("Please enter data!")
  }
var storageRef=firebase.storage().ref('WorkingSchedule/'+file.name);
var uploadtask = storageRef.put(file);

uploadtask.on('state_changed',

/**
* @function progress
* @description shows the user the percentage of the upload
* @param snapshot
*/
  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader.value = percentage;
  },

/**
* @function error 
* @description lets the user know that this has failed with a message
* @param err
*/
  function error(err){
    console.log("failed");
  },

/**
* @function complete
* @description lets the user know that the upload is complete with a message and
* and creates urls for the information 
*/
  function complete(){
    console.log('Successful');
     var postKey = firebase.database().ref('WorkingSchedule/').push().key;
     var title = document.getElementById('fileTitle').value;
     var title2 = "xtsx"+ title +"xtex";
     storageRef.getDownloadURL().then(function(url){
       console.log("Success");
       console.log(url);
       var updates = {};
       var postData={
       url : url,
       id : postKey,
       titleAndroid : title2,
       titleIOS : title,
       filename: file.name
     };
     updates['WorkingSchedule/' + postKey] = postData;
     firebase.database().ref().update(updates);
    alert ("Entered Succesfully");
     window.location.reload();

     });
  }
);
}


//Display WS table
var rowIndexWS = 1;
var ws = [];
var fbWS = firebase.database().ref('WorkingSchedule')
var WStable = document.getElementById('WStable');

fbWS.once('value',function(snapshot){
snapshot.forEach(function(childSnapshot){
  ws[rowIndexWS] = childSnapshot.key;
  var childData = childSnapshot.val();
  var button = document.createElement("button");
  var button2 = document.createElement("button");
  button.innerHTML="Download";
  button2.innerHTML="Delete";


  var row = WStable.insertRow(rowIndexWS);
  //var cellId = row.insertCell(0)
  var cellWSTitle = row.insertCell(0);
  var cellButton = row.insertCell(1);
  var cellButton2 = row.insertCell(2);
  //cellId.appendChild(document.createTextNode(childKey));
  cellWSTitle.appendChild(document.createTextNode(childData.titleIOS));
  cellButton.appendChild(button);
  cellButton2.appendChild(button2);
  button.setAttribute("id","downloadWS_id["+rowIndexWS+"]");
  button.setAttribute("onclick","downloadWS("+rowIndexWS+")");
  button2.setAttribute("id","deleteWS_id["+rowIndexWS+"]");
  button2.setAttribute("onclick","deleteWS("+rowIndexWS+")");

  rowIndexWS = rowIndexWS + 1;

});
});

/**
* @function deleteWS
* @description deletes the work schedule
*/
function deleteWS(rowIndexWS){
var fbWS= firebase.database().ref('WorkingSchedule');
//var Ukey = $(this).closest('tr').children('td:first').text();
var Ukey = ws[rowIndexWS];
console.log(Ukey);
var r = confirm("Are you sure you want to delete a working schedule?");
if (r == true) {
    fbWS.child(Ukey+"/filename").once('value').
    then(function(snapshot){
        var storageRef=firebase.storage().ref();
        storageRef.child("WorkingSchedule/"+snapshot.val()).delete().then(function(){
            fbWS.child(Ukey).remove();
            alert("successfully deleted!");
            window.location.reload();
        });
    });
}
else {
}
}

/**
* @function downloadWS
* @description allows downloading a work schedule
*/
function downloadWS(rowIndexWS){
var fbWS= firebase.database().ref('WorkingSchedule');
console.log(rowIndexWS);
//var Ukey = $(this).closest('tr').children('td:first').text();
var Ukey = ws[rowIndexWS];
var url = fbWS.child(Ukey).child('url');
let downloadURL;
url.once("value").then(function(snapshot){
   downloadURL = snapshot.val();
   console.log(downloadURL);
   window.open(downloadURL,'_blank');
});
}

/**
* @function DownloadNewWS
* @description allows you to download a new work schedule
*/
function DownloadNewWS(){
var url= firebase.storage().ref('CenterSchedule/wsnew.xlsx');
url.getDownloadURL().then(function(ur2) {
      window.location = ur2;
   });
   }


//Working hour

/**
* @function AddNewWH
* @description allows adding new work hours
*/
function AddNewWH(){
document.getElementById('newWHBlock').style.display ='block';
}

/**
* @function DownloadNewWH
* @description allows one to down load the new work hours
*/
function DownloadNewWH(){
var url= firebase.storage().ref('CenterSchedule/whnew.xlsx');
url.getDownloadURL().then(function(ur2) {
      window.location = ur2;
   });
   }

//Upload file
var uploader2 = document.getElementById('uploader2');
var fileButton2 = document.getElementById('fileButton2');
var submitfileButton2 = document.getElementById('btnSubmitWH')

fileButton2.addEventListener('change', handleuploadfile2);
submitfileButton2.addEventListener('click', handleuploadfileSubmit2);

let file2;

/**
* @function handleuploadfile2
* @description 
* @param e
*/
function handleuploadfile2(e) {
 file2=e.target.files[0];
}

/**
* @function handleuploadfileSubmit2
* @description 
* @param e
*/
function handleuploadfileSubmit2(e) {
  if(file2 == undefined){
    alert ("Please enter data!")
  }
var storageRef=firebase.storage().ref('WorkingHourRecord/'+file2.name);
var uploadtask = storageRef.put(file2);

uploadtask.on('state_changed',

/**
* @function progress
* @description shows the user the percentage of the upload
* @param snapshot
*/
  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader2.value = percentage;
  },

/**
* @function error 
* @description lets the user know that this has failed with a message
* @param err
*/
  function error(err){
    console.log("failed");
  },

/**
* @function complete
* @description lets the user know that the upload is complete with a message and
* and creates urls for the information 
*/
  function complete(){
    console.log('Successful');
     var postKey = firebase.database().ref('WorkingHourRecord/').push().key;
     var title = document.getElementById('fileTitle2').value;
     var title2 = 'xtsx'+title+'xtex';
     storageRef.getDownloadURL().then(function(url){
       console.log("Success");
       console.log(url);
       var updates = {};
       var postData={
       url : url,
       id : postKey,
       titleAndroid : title2,
       titleIOS : title,
       filename: file2.name

     };
     updates['WorkingHourRecord/' + postKey] = postData;
     firebase.database().ref().update(updates);
    alert ("Entered Succesfully");
     window.location.reload();

     });
  }
);
}

//Display all Working Hour
var rowIndexWH = 1;
var wh = [];
var fbWH = firebase.database().ref('WorkingHourRecord')
var tableWH = document.getElementById('tableWH');

fbWH.once('value',function(snapshot){
snapshot.forEach(function(childSnapshot){
wh[rowIndexWH] = childSnapshot.key;
  //var childKey = childSnapshot.key;
  var childData = childSnapshot.val();
  var button = document.createElement("button");
  var button2 = document.createElement("button");
  button.innerHTML="Download";
  button2.innerHTML="Delete";


  var row = tableWH.insertRow(rowIndexWH);
 // var cellId = row.insertCell(0)
  var cellWHTitle = row.insertCell(0);
  var cellButton = row.insertCell(1);
  var cellButton2 = row.insertCell(2);
  //cellId.appendChild(document.createTextNode(childKey));
  cellWHTitle.appendChild(document.createTextNode(childData.titleIOS));
  cellButton.appendChild(button);
  cellButton2.appendChild(button2);
  button.setAttribute("id","downloadWH_id["+rowIndexWH+"]");
  button.setAttribute("onclick","downloadWH("+rowIndexWH+")");
  button2.setAttribute("id","deleteWH_id["+rowIndexWH+"]");
  button2.setAttribute("onclick","deleteWH("+rowIndexWH+")");

  rowIndexWH = rowIndexWH + 1;
});
});

/**
* @function deleteWH
* @description allows for deletion of work hours
*/
function deleteWH(rowIndexWH){
var fbWH= firebase.database().ref('WorkingHourRecord');
var Ukey = wh[rowIndexWH];
console.log(Ukey);
var r = confirm("Are you sure you want to delete a working hour?");
if (r == true) {
    fbWH.child(Ukey+"/filename").once('value').
    then(function(snapshot){
        var storageRef=firebase.storage().ref();
        storageRef.child("WorkingHourRecord/"+snapshot.val()).delete().then(function(){
            fbWH.child(Ukey).remove();
            alert("successfully deleted!");
            window.location.reload();
       });
    });
}
}

/**
* @function downloadWH
* @description allows for work hour deletion
*/
function downloadWH(rowIndexWH){
var fbWH= firebase.database().ref('WorkingHourRecord');
var Ukey = wh[rowIndexWH];
var url = fbWH.child(Ukey).child('url');
let downloadURL;
url.once("value").then(function(snapshot){
   downloadURL = snapshot.val();
   console.log(downloadURL);
   window.open(downloadURL,'_blank') ;
});
}

/**
* @function showannouncement
* @description uh, shows announcments
*/
function showannouncement(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("announcementspan").style.opacity = "1";
  document.getElementById("csspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = ".8";
  document.getElementById("whspan").style.opacity = ".8";
}

/**
* @function showcs
* @description shows center schedule
*/
function showcs(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "none";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("csspan").style.opacity = "1";
  document.getElementById("wsspan").style.opacity = ".8";
  document.getElementById("whspan").style.opacity = ".8";
}

/**
* @function showws
* @description shows work schedule 
*/
function showws(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("data4").style.display = "none";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("csspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = "1";
  document.getElementById("whspan").style.opacity = ".8";
}

/**
* @function showwh
* @description shows work hours
*/
function showwh(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "none";
  document.getElementById("data3").style.display = "none";
  document.getElementById("data4").style.display = "block";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("csspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = ".8";
  document.getElementById("whspan").style.opacity = "1";
}

/**
* @function openmenu
* @description opens the menu
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
