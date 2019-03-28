/**
 * @file Mytask.js
 * @author  MCU
 * @author  Kutztown University
 * @license
*/

var goodPath = "";
var num1 = 0; // keep track of table row for check box
var checkbox_name = []; // used in table for check box
var i = 0;
var c = 0; 

//get staffID from google generated UID
firebase.auth().onAuthStateChanged(function (firebaseUser){
  if(firebaseUser){
    var userid = -1;
          
    var fbGet= firebase.database().ref('UID');
    fbGet.once('value',function(snapshot){
      snapshot.forEach(function(newSnap){
        if (newSnap.key == firebaseUser.uid){
          userid = newSnap.val();
          //do queries in here to use userid:
                  
          //MyTaskList query - get from uAccount
          //put task IDs and task names into arrays
          var fbMTL = firebase.database().ref("uAccount/"+userid+"/MyTaskList");
          fbMTL.once("value")
          .then(function(snapshotMTL){
            var taskIDArray = [];
            snapshotMTL.forEach(function(snapshotTaskIDs) {
              var tid = snapshotTaskIDs.val();
              taskIDArray.push(tid);
            }); //end snapshotTaskIDs
                      
            // do queries here with tasks from MyTaskList:
            for (i = taskIDArray.length; i > 0; i--) { 
              getTaskPath(taskIDArray[i-1], getTaskPathCallback);
            } //end for loop

          }); //end snapshotMTL
        } //end if newSnap.key == firebaseUser.uid
      }); //end function(newSnap)
    }); //end function(snapshot)
  } //end if firebaseUser
}); //end function(firebaseUser)


/**
 * @function getTaskPath
 * @description gets the task path of a task given an ID; calls function to add to table in UI
 * @param {*} taskID task ID of task retrieved from MyTaskList array
 * @param {*} callback function to execute when the task path is determined
*/
function getTaskPath(taskID, callback){
  var listOfTasks = "";
  var fbGet= firebase.database().ref('TaskInstruction')   //Get all the task categories

  fbGet.once('value',function(snapshot){  //Get a snapshot of the data in the TaskInstruction part of the database.
    taskPath = "TaskInstruction";
    
    // Loop through each of the categories
    snapshot.forEach(function(catSnapshot)  { 
      var cat = catSnapshot.key;
      taskPath = "TaskInstruction/" + cat + "/";

      // Loop through each of the tasks IDs
      catSnapshot.forEach(function(taskIDSnapshot){
        var task = taskIDSnapshot.key;
        if (taskIDSnapshot.val()['TaskID'] == taskID){
          taskPath += taskIDSnapshot.key;
          goodPath = taskPath;
          getTaskPathCallback(taskIDSnapshot.val()); //callback function after getting the path to the task we're looking for.
          return;
        } //end if taskIDSnapshot.val()['TaskID'] == taskID
        listOfTasks += "\n" +  task;
      
      }); //end function(taskIDSnapshot)
    }); //end function(catSnapshot)
    taskPath = "";

  }); //end function(snapshot)
} //end getTaskPath


/**
 * @function getTaskPathCallback
 * @description adds task information to table in the UI
 * @param {*} task the task object retrieved from the database
 */
function getTaskPathCallback(task){
  var category = task["Info"]["Category"];
  var tName = task["Info"]["Title"];
  var tID = task["TaskID"];
  var published = task["Info"]["Published"];
  if(published == true){published = "Yes";}
  else{published = "No";}
  var visible = task["Info"]["Visible"];
  if(visible == true){visible = "Yes";}
  else{visible = "No";}

  // add category to filter options
  var addCategory = document.getElementById("filterCategory"); //get filter category list element
  //console.log("filtercategory: "+addCategory);
  var opt = document.createElement("option"); //create option to be added to category drop down
  opt.text = category;
  addCategory.add(opt); //add to filter category list

  // add task to table
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");

  var taskName = document.getElementById("filterTaskList");
  var opt1 = document.createElement("option");
  opt1.text = tName;
  taskName.add(opt1);
    
  num1 = num1 +1;
  var row = assigningTask.insertRow(-1);
  c++;
  tr[c].style.display = "table-row";
  
  var cellCategory = row.insertCell(-1);
  cellCategory.appendChild(document.createTextNode(category));
  
  var cellName = row.insertCell(-1);
  cellName.appendChild(document.createTextNode(tName));
    
  var cellVisibility = row.insertCell(-1);
  cellVisibility.appendChild(document.createTextNode(published));
  var cellPublished = row.insertCell(-1);
  cellPublished.appendChild(document.createTextNode(visible));

  var detailButton = document.createElement("button");
  detailButton.setAttribute("id","button_id["+num1+"]");
  detailButton.setAttribute("onclick", "display_Detail("+num1+")");
  detailButton.innerHTML="Details";
  var cellDetailButton= row.insertCell(-1);
  cellDetailButton.appendChild(detailButton);
  
  var editButton = document.createElement("button");
  editButton.setAttribute("id","editButton_id["+num1+"]");
  editButton.setAttribute("onclick", "directTask("+num1+")");
  editButton.innerHTML="Edit";
  var cellEditButton= row.insertCell(-1);
  cellEditButton.appendChild(editButton);
    
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("id","deleteButton_id["+num1+"]");
  deleteButton.setAttribute("onclick", "removeTaskMyList("+num1+")");
  deleteButton.innerHTML="Remove";
  var cellDeleteButton = row.insertCell(-1);
  cellDeleteButton.appendChild(deleteButton);

  var cellTID = row.insertCell(-1);
  cellTID.appendChild(document.createTextNode(tID));
  cellTID.style.display = "none";

  var checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.setAttribute("id", "checkbox_name["+num1+"]");

  //console.log("TASK NAME: "+ tName);
  return;
}


/**
   * @function toggleTask
   * @description when check box in the header row in the task list table in Library > Assign Task is clicked
   *   all of the tasks are either selected or deselected
   * @param {*} source status of checkbox - checked or unchecked
*/
function toggleTask(source) {
var table = document.getElementById("assigningTask");
var tr = table.getElementsByTagName("tr");
var length = tr.length-1;
//console.log(length);
    if(source.checked){
        for(var i = 1; i < tr.length; i++){
            if( tr[i].style.display ==  ""){
                var c = i-1;
                var value = document.getElementById("checkbox_name["+c+"]");
                value.checked = false;
            }
            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_name["+c+"]");
                value.checked = true;
            }
        }
    }
    else{
        for(var i = 1; i < tr.length; i= i+1){
            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_name["+c+"]");
                value.checked = false;
            }
        }
    }
}

/**
 * @function assign
 * @description selected task is assigned to selected assignees
*/
function assign(){
  document.getElementById("library_requestCopy")
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var table1 = document.getElementById("assigningCF");
  var tr1 = table1.getElementsByTagName("tr");
  var array = [];
  var arr = [];
  var length1  = tr1.length-1;
  var length = tr.length-1;
  for(var d =  1 , c = 0; c < length1; d++){
      if (document.getElementById("checkbox_CFname["+c+"]").checked == true){
          console.log(table1.rows[d].cells[2].innerHTML);
          if(table1.rows[d].cells[0].innerHTML == "CNA"){
              for(var f = 1, i = 0; i < length; f++){
                //  console.log("CNA/"+table1.rows[d].cells[2].innerHTML+"/Task"+"/"+table.rows[f].cells[0].innerHTML+"/"+table.rows[f].cells[1].innerHTML);
                  if(document.getElementById("checkbox_name["+i+"]").checked == true){
                      firebase.database().ref("CNA/"+table1.rows[d].cells[2].innerHTML+"/Task"+"/"+table.rows[f].cells[0].innerHTML+"/"+table.rows[f].cells[1].innerHTML).set("TaskInstruction/"+table.rows[f].cells[0].innerHTML+"/"+table.rows[f].cells[1].innerHTML);
                      }
                    i++;
                  }
          }
          if(table1.rows[d].cells[0].innerHTML == "Patient"){
              for(var e = 1, g = 0; g < length; e++){
                  if(document.getElementById("checkbox_name["+g+"]").checked == true){
                  console.log("Patient/"+table1.rows[d].cells[2].innerHTML+"/Task"+"/"+table.rows[e].cells[0].innerHTML+"/"+table.rows[e].cells[1].innerHTML);
                  firebase.database().ref("Patient/"+table1.rows[d].cells[2].innerHTML+"/Task"+"/"+table.rows[e].cells[0].innerHTML+"/"+table.rows[e].cells[1].innerHTML).set("TaskInstruction/"+table.rows[e].cells[0].innerHTML+"/"+table.rows[e].cells[1].innerHTML);
                  }
                  g++;
              }
          }

  }
  c++;
  var r = alert("Task have been copied!");
  if(true){
    window.location.reload();
  }
}
}


$(document).ready(function(){
  $("#searchInput").on("keyup", function() {
    var table = document.getElementById("assigningTask");
    var value = $(this).val().toLowerCase();
    console.log(value);
          $("#assigningTask tr:not(:first)").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
    });
});

$(document).ready(function(){
  $("#searchkeyin").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#assigningCF tr:not(:first)").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

$(document).ready(function(){
  $("#searchKeyword").on("keyup", function() {
    var value = $(this).val().toLowerCase();
      $("#assigningList tr:not(:first)").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
});

/**
   * @function sortingTask
   * @description sorts the task table in Library > Assign Task
   * @param {*} n number of the column that the table is being sorted by
   */
function sortingTask(n){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("assigningTask");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

/**
   * @function filter_Category
   * @description filters task list in Library > Assign Task according
   *  to the selected task category
   */ 
function filter_Category(){
  var val = document.getElementById("filterCategory").value;
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var length = tr.length+1;
  if( val == "Category"){//all category
      for (i = 0; i < tr.length; i++) {
            tr[i].style.display =  "table-row";
      }
  }
  else{
    for (i = 0; i < tr.length; i++) {
      //console.log(tr.length);
      var td = tr[i].getElementsByTagName("td")[0];//row i cell number 7
      if(td){
        if (td.innerText == val) {
          tr[0].style.display = "table-row"
          tr[i].style.display =  "table-row";
          document.getElementById("all_checked").checked = false;
          var c = i-1;
          var value = document.getElementById("checkbox_name["+c+"]");
          //console.log("checkbox_name["+c+"]");
          if(value.checked == true){
            document.getElementById("all_checked").checked = true;
          }
        }
        else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

/**
   * @function filterTaskList
   * @description filters task table in Library > Task History according
   *  to the selected task name
   */
function filterTaskList(){
  var val = document.getElementById("filterTaskList").value;
  var table = document.getElementById("assigningList");
  var tr = table.getElementsByTagName("tr");
  if( val == "Task Name"){//all category
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display =  "table-row";
    }
  }
  else{
    for (i = 0; i < tr.length; i++) {
      var td = tr[i].getElementsByTagName("td")[4];//row i cell number 7
        if(td){
          if (td.innerText == val) {
            tr[0].style.display = "table-row"
            tr[i].style.display =  "table-row";
          }
          else {
            tr[i].style.display = "none";
          }
        }
    }
  }
}

/**
 * @function closeclose_form
 * @description close details pop up box
 */
function closeclose_form(){
    document.getElementById('form1').style.display ='none';
    console.log("Close");
    var Table = document.getElementById("data2");
    Table.innerHTML = ""
}

/**
 * @function display_Detail
 * @description in Library > Assign Task, task details are displayed in a pop
 *  up window
 * @param {*} num row number of task in displayed task list
 */
function display_Detail(num){
  document.getElementById('form1').style.display ='block';
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var p = document.createElement('p');
  var Ukey = tr[num].cells[0].innerText;
  var Ukey1 = tr[num].cells[1].innerText;
  var taskID = tr[num].cells[7].innerText;
  console.log("ID: "+ taskID)
  var fbTask= firebase.database().ref('TaskInstruction/'+Ukey+"/"+taskID);
  //document.getElementById("TaskName").innerHTML = Ukey1;
  var array = [];
  var i = 0;
  fbTask.on('value', function(snapshot){
    document.getElementById("taskname").innerHTML = Ukey1;
    document.getElementById("category").innerHTML = Ukey;

    snapshot.forEach(function(snapshot1){
      //console.log(snapshot1.key);
        if(snapshot1.key == "Info"){
          var video = snapshot1.child('videoURL').val();
          document.getElementById('video').innerHTML= video;
          var outline = snapshot1.child('OutlineIOS').val();
          document.getElementById('outline').innerHTML= outline;
          var note = snapshot1.child('NoteIOS').val();
          document.getElementById('note').innerHTML= note;
          i++;
        }
    })
  });
}


/**
 * @function directTask
 * @description Generates a path to the task in the database and redirects to the task editor.
 * @param row number of task in table
 */
function directTask(num){
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var cat = tr[num].cells[0].innerText;
  var taskN = tr[num].cells[1].innerText;
  var taskID = tr[num].cells[7].innerText;
  var taskPath = "TaskInstruction/" + cat + "/" + taskID;
  //alert (taskPath);
  sessionStorage.setItem("taskPath", taskPath);
  localStorage.setItem("taskPath", taskPath);
  localStorage.setItem("taskN", taskN);
  location.href ="./06Taskeditor2.html";

}


/**
 * @function removeTaskMyList
 * @description remove a task from MyList
 * @param row number of task in table
 */
function removeTaskMyList(num) {
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var taskID = tr[num].cells[7].innerText; //taskID to be removed

  //get userid
  firebase.auth().onAuthStateChanged(function (firebaseUser){
    if(firebaseUser){
      var userid = -1;
      var refUID= firebase.database().ref('UID');
      refUID.once('value',function(snapshotUID){
        snapshotUID.forEach(function(snapshotInsideUID){
          if (snapshotInsideUID.key == firebaseUser.uid){
            userid = snapshotInsideUID.val();
            //MyTaskList query - get from uAccount
            var fbMTL = firebase.database().ref("uAccount/"+userid+"/MyTaskList");
            fbMTL.once("value").then(function(snapshotMTL){
              snapshotMTL.forEach(function(snapshotTaskIDs) {
              var tidMTL = snapshotTaskIDs.val();
                if(tidMTL == taskID){
                  MyListTID = snapshotTaskIDs.key;
                  var taskReference = firebase.database().ref("uAccount/"+userid+"/MyTaskList/"+MyListTID);
                  taskReference.remove();
                  window.location.href ="../Frontend/10MyTask2.html";
                } //end if tidMTL == taskID
              }); //end function(snapshotTaskIDs)
            }); //end function(snapshotMTL)
          } //end if snapshotInsideUID.key == firebaseUser.uid
        }); //end function(snapshotInsideUID)
      }); //end function(snapshotUID)
    } //end if firebaseUser
  }); //end function(firebaseUser)
} //end removeTaskMyList


/**
 * @function createNewTask
 * @description get task ID for new task
 */
function createNewTask(){
  var postRef = firebase.database().ref('TaskInstruction/LastID');

  postRef.transaction(function(data) {
    //console.log("Transaction");
    
    if (data != null){
        console.log("LAST TID: "+data)
        return (data+1); //If everything is succesful, reinsert the data to the database
    } else {
        return 0; 
    }
  }, function(error, commited, snapshot){
      alert(snapshot.val());
      var TID = snapshot.val();
      createBlankTask(TID);
      //Stuff to do after the transaction is done
      var userid = $("#displayProfileid").html();
      taskPath = "TaskInstruction/Basic/"+TID;
      localStorage.setItem("taskPath", taskPath);
      //console.log("YO: "+localStorage);
      //location.href ="./06Taskeditor2.html";
  }, true);
  
}

/**
 * @function createBlankTask
 * @description create new task in database with given task ID
 * @param {*} TID new generated task ID
 */
function createBlankTask(TID){
  
  var userid = $("#displayProfileid").html();
  var taskDef = {};
  taskDef["Info"] = {};
  taskDef["Info"]["Category"] = "Basic";
  taskDef["Info"]["OutlineIOS"] = "Outline";
  taskDef["Info"]["Title"] = "Task Title";
  taskDef["Info"]["Owner"] = String(userid);
  taskDef["Info"]["VideoURL"] = "undefined";
  taskDef["Step1"] = {};
  taskDef["Step1"]["MDescriptionIOS"] = "Step Description";
  taskDef["Step1"]["MtitleIOS"] = "Step Title";
  taskDef["Step1"]["TaskID"] = TID;
  taskDef["TaskID"] = TID;
  console.log("TASK DEF:"+taskDef);
  var insertToDB = {};

  insertToDB["TaskInstruction/Basic/" + parseInt(TID)] = taskDef;
  console.log(insertToDB);

  if (firebase.database().ref().update(insertToDB)){
      alert("Save successful");
      taskPath = "TaskInstruction/Basic/"+TID;
      localStorage.setItem("taskPath", taskPath);
      
      //Put the task into the user's task list
      console.log(userid);
      var fbGet= firebase.database().ref("uAccount/"+userid);
      console.log(fbGet);
      fbGet.once("value",function(snapshot){
        console.log(snapshot.val());
        var uAccount = snapshot.val();

        if (uAccount["MyTaskList"] == null){  //myTaskList doesn't yet exist
          uAccount["MyTaskList"] = {};
          uAccount["MyTaskList"]["MyListTID1"] = TID;
          uAccount["MyTaskIndex"]={};
          uAccount["MyTaskIndex"]["Number"]=1;   
          console.log(uAccount);

          //Insert task to my task list.
          firebase.database().ref('uAccount/'+userid).update(uAccount);
          taskPath = "TaskInstruction/Basic/"+TID;
          localStorage.setItem("taskPath", taskPath);
          location.href ="./06Taskeditor2.html";


        } else {  //myTaskList already exists
          console.log(Object.keys(uAccount["MyTaskList"]).length);
          var num = uAccount["MyTaskIndex"]["Number"] + 1;
          uAccount["MyTaskIndex"]["Number"] = num;
          console.log("NUM"+num); 
          uAccount["MyTaskList"]["MyListTID" + num] = TID;
          console.log(uAccount);
          firebase.database().ref('uAccount/'+userid).update(uAccount);
          taskPath = "TaskInstruction/Basic/"+TID;
          localStorage.setItem("taskPath", taskPath);
          location.href ="./06Taskeditor2.html";

        } 
      });


      //location.href ="./06Taskeditor2.html";
  } else {
      alert("Task failed to save");
  }
  
}

