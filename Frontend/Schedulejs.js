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
  }); //end function(childSnapchot)
}); //end 

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
} //end function createNewAnnouncement

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
} //end function deleteA

//View Announcement, no editing
//WIP
function viewA(rowIndex){
  document.getElementById('viewABlock').style.display ='block';
  var Ukey = an[rowIndex];
  var fbB= firebase.database().ref('Announcements/'+Ukey);
  fbB.on('value', function(snapshot){
    var EAdata = snapshot.child('AnnouncementIOS').val();
    var EAdata2 = snapshot.child('ATitleIOS').val();
    document.getElementById('Amsg2').innerHTML = EAdata;
    document.getElementById('AEtitle3').innerHTML = EAdata2;
    document.getElementById('keyname').innerHTML = Ukey;
  });
} //end function viewA

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
} //end function editA

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
} //end function editSave



function btnpopUp(){
  document.getElementById('Esave').style.display = "inline";
} //end function btnpopUP

/*
//Events
function AddNewCS(){
document.getElementById('newCSBlock').style.display ='block';
}
*/

//Create new Working Schedule - Upload folder into firebase
//var uploader3 = document.getElementById('uploader3');
//var fileButton3 = document.getElementById('fileButton3');
//var submitfileButton3 = document.getElementById('btnSubmitCS');

//fileButton3.addEventListener('change', handleuploadfile3);
//submitfileButton3.addEventListener('click', handleuploadfileSubmit3);

//let file3;

function handleuploadfile3(e) {
  file3=e.target.files[0];
} //end function handleuploadfile3

function handleuploadfileSubmit3(e) {
  if(file3 == undefined){
    alert ("Please enter data!")
  }
}

//var storageRef=firebase.storage().ref('CenterSchedule/'+file3.name);
//var uploadtask3 = storageRef.put(file3);
/*
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
      // alert ("Please input")
    //else {
      updates['CenterSchedule/' + postKey] = postData;
      firebase.database().ref().update(updates);
      alert ("Entered Succesfully");
      window.location.reload();
    //}
    });
  });
}
*/



//Display CS table
var cs = [];
var rowIndexCS = 1;
var fbCS = firebase.database().ref('CenterSchedule')
var weeks = [];

//get weeks stored in an array
fbCS.once('value',function(snapshot){
  //console.log(snapshot.numChildren());
  snapshot.forEach(function(Week){
    weekOf = Week.key;
    weeks.push(weekOf);
  });

  console.log(weeks);
  injectToDOM(weeks);
});



/**
* @function injectToDOM
* @description query for data for individual days given the week, then display in DOM
* @param {*} weeks array of weeks that have schedules
*/
function injectToDOM(weeks){
  var htmlInjection;
  count = 0;

  htmlInjection = '<table style="width:100%; border: 1px solid black;">';
  for (var i = weeks.length-1; i >= 0; i--){
    var weekSched = firebase.database().ref('CenterSchedule/'+weeks[i]+'/'); 
    weekSched.once('value',function(days){
      count++;

      times = [];
      times = days.val();

      temp = '"'+days.key+'"';

      htmlInjection += '<tr><td style="width:10%">'+days.key+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Sunday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Monday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Tuesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Wednesday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Thursday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Friday"]+'</td>';
      htmlInjection += '<td style="width:10%">'+times["Saturday"]+'</td>';
      htmlInjection += '<td style="width:10%"><button id="edit'+days.key+'" onclick="editCenterSchedule(\''+days.key+'\')" style="cursor:pointer;">Edit</button></td>';
      htmlInjection += '<td style="width:10%"><button id="delete'+days.key+'" onclick="deleteCenterSchedule(\''+days.key+'\')" style="cursor:pointer;">Delete</button></td>';
      htmlInjection += '</tr>';

      

      if(count = weeks.length) //if reached the end of the list of weeks
      {
        $("#CenterScheduleInfo").html(htmlInjection); //Insert the HTML for the tasks into the DOM
      } //end if
    }); //end weekSched.once('value',function(days){
  } //end for
} //end injectToDOM

/**
 * @function createNewCenterSchedule
 * @description creates new center schedule for the week
 */
function createNewCenterSchedule(){
  var ymd = $("#selected_date").val();

  var SunData = $("#NewCSSun").val();
  var MonData = $("#NewCSMon").val();
  var TueData = $("#NewCSTue").val();
  var WedData = $("#NewCSWed").val();
  var ThuData = $("#NewCSThu").val();
  var FriData = $("#NewCSFri").val();
  var SatData = $("#NewCSSat").val();

  //var temp = getSundayOfCurrentWeek(ymd);
  //console.log(temp);

  var fields = "";
  if(ymd == ""){
    fields += "Week Of\n";
    //alert("The year entered has exceeded one hundred years!");
  }
  if(SunData == ""){
    fields += "Sunday\n";
    //alert ("Please enter Sunday data");
  }
  if(MonData == ""){
    fields += "Monday\n";
    //alert ("Please enter Monday data");
  }
  if(TueData == ""){
    fields += "Tuesday\n";
    //alert ("Please enter Tuesday data");
  }
  if(WedData == ""){
    fields += "Wednesday\n";
    //alert ("Please enter Wednesday data");
  }
  if(ThuData == ""){
    fields += "Thursday\n";
    //alert ("Please enter Thursday data");
  }
  if(FriData == ""){
    fields += "Friday\n";
    //alert ("Please enter Friday data");
  }
  if(SatData == ""){
    fields += "Saturday\n";
    //alert ("Please enter Saturday data");
  }
  if(ymd == "" || SunData == "" || MonData == "" ||
  TueData == "" || WedData == "" || ThuData == "" ||
  FriData == "" || SatData == "") {
    alert ("Please enter the following data:\n"+fields);
  }
  
  else {
    var r = confirm("Are you sure you want to create a new Center Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunData,
        Monday : MonData,
        Tuesday : TueData,
        Wednesday : WedData,
        Thursday : ThuData,
        Friday : FriData,
        Saturday : SatData
      }

      var updates = {};
      updates['CenterSchedule/'+ymd] = data;
      firebase.database().ref().update(updates);
      alert('Successfully created a new Center Schedule for the week of '+ ymd);
      //close_form();
      document.getElementById('newCSBlock').style.display ='none';
      //window.location.reload();
      location.href ="./02Schedule2.html";
    }
  }
} //end function createNewCenterSchedule

/*
function getSundayOfCurrentWeek(d)
{
    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?0:7)-day );
}
*/

/**
 * @function editCenterSchedule
 * @description queries for selected center schedule, calls to fill form
 * @param {*} date selected center schedule to be edited
 */
function editCenterSchedule(date) {
  document.getElementById('editWSBlock').style.display ='block';
  console.log(date);
  var fbB= firebase.database().ref('CenterSchedule/'+date);
  fbB.on('value', function(CSsnapshot){
    var times = [];
    times = CSsnapshot.val(); 
    setCSEditFields(CSsnapshot.key, times);
  });
} //end editCenterSchedule

/**
 * @function setCSEditFields
 * @description updates edit center schedule form with values for selected week
 * @param {*} weekOf week selected
 * @param {*} times array of times for 7 days of the selected week
 */
function setCSEditFields(weekOf, times) {
  document.getElementById('editWeekOf').innerHTML = weekOf;
  document.getElementById('editCSSun').value = times["Sunday"];
  document.getElementById('editCSMon').value = times["Monday"];
  document.getElementById('editCSTue').value = times["Tuesday"];
  document.getElementById('editCSWed').value = times["Wednesday"];
  document.getElementById('editCSThu').value = times["Thursday"];
  document.getElementById('editCSFri').value = times["Friday"];
  document.getElementById('editCSSat').value = times["Saturday"];
} //end setCSEditFields

/**
 * @function submitEditCenterSchedule
 * @description submits edited center schedule
 */
function submitEditCenterSchedule(){
  var ymd = document.getElementById('editWeekOf').innerHTML

  var SunData = $("#editCSSun").val();
  var MonData = $("#editCSMon").val();
  var TueData = $("#editCSTue").val();
  var WedData = $("#editCSWed").val();
  var ThuData = $("#editCSThu").val();
  var FriData = $("#editCSFri").val();
  var SatData = $("#editCSSat").val();

  //create alert message
  var fields = "";
  if(ymd == ""){fields += "Week Of\n";}
  if(SunData == ""){fields += "Sunday\n";}
  if(MonData == ""){fields += "Monday\n";}
  if(TueData == ""){fields += "Tuesday\n";}
  if(WedData == ""){fields += "Wednesday\n";}
  if(ThuData == ""){fields += "Thursday\n";}
  if(FriData == ""){fields += "Friday\n";}
  if(SatData == ""){fields += "Saturday\n";}
  if(ymd == "" || SunData == "" || MonData == "" ||
  TueData == "" || WedData == "" || ThuData == "" ||
  FriData == "" || SatData == "") {
    alert ("Please enter the following data:\n"+fields);
  }
  
  else {
    var r = confirm("Are you sure you want edit this Center Schedule?");
    if (r == true) {

      var data = {
        Sunday : SunData,
        Monday : MonData,
        Tuesday : TueData,
        Wednesday : WedData,
        Thursday : ThuData,
        Friday : FriData,
        Saturday : SatData
      }

      var updates = {};
      updates['CenterSchedule/'+ymd] = data;
      firebase.database().ref().update(updates);
      alert('Successfully edited Center Schedule for the Week of '+ymd);
      document.getElementById('editWSBlock').style.display ='none';
      location.href ="./02Schedule2.html";
    } //end if
  } //end else
} //end function submitEditCenterSchedule

/**
 * @function deleteCenterSchedule
 * @description deletes center schedule for selected week from the database
 * @param {*} date selected center schedule to be removed
 */
function deleteCenterSchedule(date) {
  var fbB= firebase.database().ref('CenterSchedule');
  console.log(date);
  var r = confirm("Are you sure you want to delete the center schedule for the week of "+date+"?");
  if (r == true) {
    fbB.child(date).remove();
    alert("successfully deleted!");
    location.href ="./02Schedule2.html";
  } //end if
  else {
  }
} //end deleteCenterSchedule

/*
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
} //end function createNewAnnouncement
*/


//Working Schedule table
function AddNewCS(){
  document.getElementById("NewCSSun").value = "";
  document.getElementById("NewCSMon").value = "";
  document.getElementById("NewCSTue").value = "";
  document.getElementById("NewCSWed").value = "";
  document.getElementById("NewCSThu").value = "";
  document.getElementById("NewCSFri").value = "";
  document.getElementById("NewCSSat").value = "";
  //document.getElementById("selected_date").value = year+"-"+mm+"-"+dd;
  document.getElementById('newCSBlock').style.display ='block';
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
