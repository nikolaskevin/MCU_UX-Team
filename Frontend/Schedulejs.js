var btnLogout = document.getElementById('btnLogout')
/*btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location = 'Login.html';
});*/

//Create new Announcement button
function AddNewA(){
    document.getElementById('newABlock').style.display ='block';
}

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
    var button3 = document.createElement("button");
    button.innerHTML="Detail";
    button2.innerHTML = "Edit";
    button3.innerHTML="Delete";
    var row = Atable.insertRow(rowIndex);
    
    var cellAnnouncement= row.insertCell(0);
    var cellButton= row.insertCell(1)
    var cellButton2= row.insertCell(2);
    var cellButton3= row.insertCell(3);
    
    cellAnnouncement.appendChild(document.createTextNode(childData.ATitleIOS));
    cellButton.appendChild(button);
    cellButton2.appendChild(button2);
    cellButton3.appendChild(button3);
    button.setAttribute("id","viewA_id["+rowIndex+"]");
    button.setAttribute("onclick","viewA("+rowIndex+")");
    button2.setAttribute("id","editA_id["+rowIndex+"]");
    button2.setAttribute("onclick","editA("+rowIndex+")");
    button3.setAttribute("id","deleteA_id["+rowIndex+"]");
    button3.setAttribute("onclick","deleteA("+rowIndex+")");

    rowIndex = rowIndex + 1;

  });
});

//createNew Announcement Data
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
}

//Deleting Announcements
function deleteA(rowIndex){
  var fbB= firebase.database().ref('Announcements');

  var Ukey = an[rowIndex];
  console.log(Ukey);
  var r = confirm("Are you sure you want to delete an announcement?");
    if (r == true) {
        fbB.child(Ukey).remove();
        alert("successfully deleted!");
        window.location.reload();
    }
    else {
    }
}

//View Announcement, no editing
//WIP
function viewA(rowIndex){
  document.getElementById('viewABlock').style.display = 'block';
  var Ukey = an[rowIndex];
  var fbB= firebase.database().ref('Announcements/'+Ukey);
  fbB.on('value', function(snapshot){
    var EAdata = snapshot.child('AnnouncementIOS').val();
    var EAdata2 = snapshot.child('ATitleIOS').val();
    document.getElementById('Amsg').value = EAdata;
    document.getElementById('AEtitle2').value = EAdata2;
    document.getElementById('keyname').innerHTML = Ukey;
  });
}

//Edit Announcement, no viewing
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

}
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
}

function btnpopUp(){
  document.getElementById('Esave').style.display = "inline";

}

//Events
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

function handleuploadfile3(e) {
 file3=e.target.files[0];

}

function handleuploadfileSubmit3(e) {
  if(file3 == undefined){
    alert ("Please enter data!")
  }
var storageRef=firebase.storage().ref('CenterSchedule/'+file3.name);
var uploadtask3 = storageRef.put(file3);

uploadtask3.on('state_changed',

  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader.value = percentage;
  },

  function error(err){
    console.log("failed");
  },

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
  }
);
}


function getWeek(){
  var fbCS = firebase.database().ref('CenterSchedule')
}

//Display CS table
var cs = [];
var rowIndexCS = 1;
var fbCS = firebase.database().ref('CenterSchedule')
console.log("HELLO");
console.log(fbCS);

fbCS.once('value',function(snapshot){
  snapshot.forEach(function(Week){
    weekOf = Week.key;
    var days = {Sunday: "", Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "", Saturday: ""};
    var sched = Week.val();


    console.log(days);
    console.log(sched);

    days["Sunday"]= sched["Sunday"];
    days["Monday"]= sched["Monday"];
    days["Tuesday"]= sched["Tuesday"];
    days["Wednesday"]= sched["Wednesday"];
    days["Thursday"]= sched["Thursday"];
    days["Friday"]= sched["Friday"];
    days["Saturday"]= sched["Saturday"];

    console.log(days);
    injectToDOM(days);

    
    var childData = Week.val();
    var button = document.createElement("button");
    var button2 = document.createElement("button");
    button.innerHTML="Download";
    button2.innerHTML="Delete";

  });
});

function injectToDOM(days){
  var htmlInjection;
  htmlInjection = "";
  htmlInjection += '<tr><td style="width:10%">'+weekOf+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Sunday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Monday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Tuesday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Wednesday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Thursday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Friday"]+'</td>';
  htmlInjection += '<td style="width:10%">'+days["Sunday"]+'</td>';
  htmlInjection += '<td style="width:10%">Edit</th>';
  htmlInjection += '<td style="width:10%">Delete</th>';
  htmlInjection += '</tr>';

  $("#CenterScheduleInfo").html(htmlInjection); //Insert the HTML for the tasks into the DOM

}

//CS deletion
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
}

//CS download
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
}


function DownloadNewCS(){
var url= firebase.storage().ref('CenterSchedule/csnew.xlsx');
url.getDownloadURL().then(function(ur2) {
      window.location = ur2;
   });
   }


//Working Schedule table
function AddNewWS(){
document.getElementById('newWSBlock').style.display ='block';
}

//Create new Working Schedule - Upload folder into firebase
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
var submitfileButton = document.getElementById('btnSubmitWS')

fileButton.addEventListener('change', handleuploadfile);
submitfileButton.addEventListener('click', handleuploadfileSubmit);

let file;

function handleuploadfile(e) {
 file=e.target.files[0];
}

function handleuploadfileSubmit(e) {
  if(file == undefined){
    alert ("Please enter data!")
  }
var storageRef=firebase.storage().ref('WorkingSchedule/'+file.name);
var uploadtask = storageRef.put(file);

uploadtask.on('state_changed',

  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader.value = percentage;
  },

  function error(err){
    console.log("failed");
  },

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


//WS deletion
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
//WS download
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

//Upload file
var uploader2 = document.getElementById('uploader2');
var fileButton2 = document.getElementById('fileButton2');
var submitfileButton2 = document.getElementById('btnSubmitWH')

fileButton2.addEventListener('change', handleuploadfile2);
submitfileButton2.addEventListener('click', handleuploadfileSubmit2);

let file2;

function handleuploadfile2(e) {
 file2=e.target.files[0];
}

function handleuploadfileSubmit2(e) {
  if(file2 == undefined){
    alert ("Please enter data!")
  }
var storageRef=firebase.storage().ref('WorkingHourRecord/'+file2.name);
var uploadtask = storageRef.put(file2);

uploadtask.on('state_changed',

  function progress(snapshot){
    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploader2.value = percentage;
  },

  function error(err){
    console.log("failed");
  },

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

function showannouncement(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data3").style.display = "none";
  document.getElementById("announcementspan").style.opacity = "1";
  document.getElementById("csspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = ".8";
  
}

function showws(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data3").style.display = "block";
  document.getElementById("announcementspan").style.opacity = ".8";
  document.getElementById("csspan").style.opacity = ".8";
  document.getElementById("wsspan").style.opacity = "1";
  
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
