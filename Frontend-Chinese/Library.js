/**
 * @file Library.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */



//for task details
/* It would be better to use JQuery to generate the HTML for the task steps dynamically rather than generating HTML code in raw strings */
/* This refactoring would make it easier to edit in the future */
var taskDetails=[];
var categories=[];
var steps=[];
var goodPath = "";
//var taskSearch = "0000000000000000001";
var catSnapshot;

//var goodPath = localStorage.getItem("taskPath");
//var taskN = localStorage.getItem("taskN");
var defImage = "https://i.imgur.com/d0H6zwB.png";
//taskPath = goodPath;
//var goodPath = window.path;


var fbGet = firebase.database().ref('TaskInstruction/');
var fbCopy = firebase.database().ref('uAccount/');
var copy = document.getElementById("library_requestCopy");
var num = 0;
var checkbox_name = [];
fbGet.once("value")
.then(function(snapshot){
    var array = [];
    var index = 0;
    // Loops through the categories in Task Instruction and stores it in an array
    var catSnapshot = [];
    var i = 0;
    // Loops through the task IDs in each categories and stores in an array
    var taskID = [];
    var rowIndex = 1;
    var c = 0;

/**
* @description grabs the information from firebase under the "Task Instruction" node and outputs 
* it into the table in the Library by rows
*/
snapshot.forEach(function(childSnapshot1){
      var catChild = childSnapshot1.key;
      if (catChild == "LastID" || catChild == "on"){  
        return; //Exit when we're done looping through the categories
      }
      catSnapshot.push(catChild);
      var filterCategory = document.getElementById("filterCategory");
      var option = document.createElement("option");
      option.text= catSnapshot[i];
      filterCategory.add(option);
      i = i +1;
      var table = document.getElementById("assigningTask");
      var tr = table.getElementsByTagName("tr");
      childSnapshot1.forEach(function(childSnapshot2){
        var taskChild = childSnapshot2.key;
        //$(tr).css("display","none");
      
        //.table(taskID);
        taskID.push(taskChild);
        var filterTask = document.getElementById("filterTaskList");
        //(filterTask);
        var opt1 = document.createElement("option");
        opt1.text = taskID[c];
            //.table(c);
        filterTask.add(opt1);
        var button = document.createElement("button");
        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.setAttribute("id", "checkbox_name["+num+"]");
        checkBox.setAttribute("name", num);
        button.setAttribute("id","button_id["+num+"]");
        button.setAttribute("onclick", "display_Detail("+num+")");
        num = num +1;
        var row = assigningTask.insertRow(-1);
        c++;
        tr[c].style.display = "table-row";
      
        var cellCategory = row.insertCell(-1);
        cellCategory.appendChild(document.createTextNode(childSnapshot1.key));
            
        var cellName = row.insertCell(-1);
        cellName.appendChild(document.createTextNode(childSnapshot2.val()["Info"]["Title"]));
            
        //Put the ID in a hidden cell in the table to access later
        var cellID = row.insertCell(-1);
        cellID.setAttribute("id","id_holder["+num+"]");
        cellID.appendChild(document.createTextNode(childSnapshot2.val()["TaskID"]));
        cellID.setAttribute("hidden", true);
        button.innerHTML="Detail";
            
        var cellButton= row.insertCell(-1);
        cellButton.appendChild(button);
            
        var cellCheckbox = row.insertCell(-1);
        cellCheckbox.appendChild(checkBox);
        if (childSnapshot2.val()["Info"]["Visible"] === false || childSnapshot2.val()["Info"]["Published"] === false){
          $(tr[c]).html("");
          $(tr[c]).css("display","none");
        } else {
          console.log(childSnapshot2.val());
        }
      })
    })
  })


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
//(length);
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
 * @function toggleCF
 * @description when check box in the header row in the assignee list table in Library > Assign Task is clicked
  *   all of the people are either selected or deselected
 * @param {*} source status of checkbox - checked or unchecked
 */
function toggleCF(source) {
    var table = document.getElementById("assigningCF");
    var tr = table.getElementsByTagName("tr");
    var length = tr.length-1;
    if(source.checked){
        for(var i = 1; i < tr.length; i++){
            if( tr[i].style.display ==  ""){
                var c = i-1;
                var value = document.getElementById("checkbox_CFname["+c+"]");
                value.checked = false;
            }
            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_CFname["+c+"]");
                value.checked = true;
            }
        }
    }
    else{
        for(var i = 1; i < tr.length; i= i+1){
            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_CFname["+c+"]");
                value.checked = false;
            }
        }
    }
}

/**
 * @function toggleList
 * @description when check box in the header row in the task list table in Library > Task History is clicked
  *   all of the rows are either selected or deselected
 * @param {*} source status of checkbox - checked or unchecked
 */
function toggleList(source) {
    var table = document.getElementById("assigningList");
    var tr = table.getElementsByTagName("tr");
    var length = tr.length -1;
    //(length);
    if(source.checked){
        for(var i = 1; i < tr.length; i++){
            if( tr[i].style.display ==  ""){
                var c = i-1;
                var value = document.getElementById("checkbox_id["+c+"]");
                value.checked = false;
            }
            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_id["+c+"]");
                value.checked = true;
            }
        }
    }
    else{
        for(var i = 1; i < tr.length; i++){

            if(tr[i].style.display == "table-row"){
                var c = i-1;
                var value = document.getElementById("checkbox_id["+c+"]");
                value.checked = false;
            }
        }
    }
}




$(document).ready(function(){
  $("#searchInput").on("keyup", function() {
    var table = document.getElementById("assigningTask");
    var value = $(this).val().toLowerCase();
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
        //(value);
        $("#assigningList tr:not(:first)").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });

    //Prevents page from reloading upon hitting enter button
    $(document).ready(function() {
      $("#searchInput").keydown(function(event){
        if(event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });
    });

   /**
     * @function sortingCF
     * @description sorts the assignee table in Library > Assign Task
     * @param {*} n number of the column that the table is being sorted by
     */
    function sortingCF(n){
      var table, rows, switching, i, filterCategory, taskID, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById("assigningCF");
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
          filterCategory = rows[i].getElementsByTagName("TD")[n];
          taskID = rows[i + 1].getElementsByTagName("TD")[n];
          /*check if the two rows should switch place,
          based on the direction, asc or desc:*/
          if (dir == "asc") {
            if (filterCategory.innerHTML.toLowerCase() > taskID.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch= true;
              break;
            }
          } else if (dir == "desc") {
            if (filterCategory.innerHTML.toLowerCase() < taskID.innerHTML.toLowerCase()) {
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
     * @function sortingTask
     * @description sorts the task table in Library > Assign Task
     * @param {*} n number of the column that the table is being sorted by
     */
    function sortingTask(n){
      var table, rows, switching, i, filterCategory, taskID, shouldSwitch, dir, switchcount = 0;
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
          filterCategory = rows[i].getElementsByTagName("TD")[n];
          taskID = rows[i + 1].getElementsByTagName("TD")[n];
          /*check if the two rows should switch place,
          based on the direction, asc or desc:*/
          if (dir == "asc") {
            if (filterCategory.innerHTML.toLowerCase() > taskID.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch= true;
              break;
            }
          } else if (dir == "desc") {
            if (filterCategory.innerHTML.toLowerCase() < taskID.innerHTML.toLowerCase()) {
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
     * @function sortingList
     * @description sorts the task table in Library > Task History
     * @param {*} n number of the column that the table is being sorted by
     */
    function sortingList(n){
      var table, rows, switching, i, filterCategory, taskID, shouldSwitch, dir, switchcount = 0;
      table = document.getElementById("assigningList");
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
          filterCategory = rows[i].getElementsByTagName("TD")[n];
          taskID = rows[i + 1].getElementsByTagName("TD")[n];
          /*check if the two rows should switch place,
          based on the direction, asc or desc:*/
          if (dir == "asc") {
            if (filterCategory.innerHTML.toLowerCase() > taskID.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch= true;
              break;
            }
          } else if (dir == "desc") {
            if (filterCategory.innerHTML.toLowerCase() < taskID.innerHTML.toLowerCase()) {
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
              //(tr.length);
            var td = tr[i].getElementsByTagName("td")[0];//row i cell number 7
            if(td){
            if (td.innerText == val) {
                tr[0].style.display = "table-row"
                tr[i].style.display =  "table-row";
                document.getElementById("all_checked").checked = false;
                var c = i-1;
                var value = document.getElementById("checkbox_name["+c+"]");
                //("checkbox_name["+c+"]");
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
     * @function filter_Position
     * @description filters assignee list in Library > Assign Task according
     *  to the selected position
     */
    function filter_Position(){
     var val = document.getElementById("filterPosition").value;
      var table = document.getElementById("assigningCF");
      var tr = table.getElementsByTagName("tr");
      if( val == "Position"){//all category
          for (i = 1; i < tr.length; i++) {
                tr[i].style.display =  "table-row";
              }
      }
      else{
          for (i = 1; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[0];//row i cell number 7
            if(td){
            if (td.innerText == val) {
                tr[0].style.display = "table-row";
                tr[i].style.display =  "table-row";
                document.getElementById("toggleCF").checked = false;
                var c = i-1;
                var value = document.getElementById("checkbox_CFname["+c+"]");
                //("checkbox_CFname["+c+"]");
                if(value.checked == true){
                        document.getElementById("toggleCF").checked = true;
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
     * @function filterNameList
     * @description filters task table in Library > Task History according
     *  to the selected name
     */
    function filterNameList(){
     var val = document.getElementById("filterNameList").value;
      var table = document.getElementById("assigningList");
      var tr = table.getElementsByTagName("tr");
      if( val == "Name"){//all category
          for (i = 1; i < tr.length; i++) {
                tr[i].style.display =  "table-row";
              }
      }
      else{
          for (i = 1; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[2];//row i cell number 7
            if(td){
            if (td.innerText == val) {
                tr[0].style.display = "table-row";
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
     * @function viewassignedtask
     * @description
     */
    function viewassignedtask(){
        document.getElementById("form").style.display = "block";
    }

    /**
     * @function close_form
     * @description close details pop up box
     * THIS ISN'T CALLED IN 05Library2.html
     */
    function close_form(){
        document.getElementById("form").style.display = "none";
        document.getElementById("popup_detail").style.display = "none";
    }


/**
 * @function closeclose_form
 * @description closes the detail form popup
 */
function closeclose_form(){
    document.getElementById('form1').style.display ='none';
    //("Close");
    var Table = document.getElementById("data2");
    Table.innerHTML = ""
    var  taskFooter = document.getElementById("taskFooter");
      taskFooter.style.display = "none";
      //.log(taskFooter);
}

/**
 * @function display_Detail
 * @description show task description and steps
 * @param {*} num 
 */
function display_Detail(num){
  taskDetails=[];
  categories=[];
  steps=[];
  goodPath = "";
  
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var cat = tr[num+1].cells[0].innerText;
  //(cat);
  var taskN = tr[num+1].cells[1].innerText;
  //(taskN);
  var taskID = tr[num+1].cells[2].innerText;
  //(taskID);
  var taskPath = "TaskInstruction/" + cat + "/" + taskID;
  //alert (taskPath);
  sessionStorage.setItem("taskPath", taskPath);
  localStorage.setItem("taskPath", taskPath);
  localStorage.setItem("taskN", taskN);

  goodPath = taskPath;

  //Start the process of loading the task
  if (goodPath != null) {
    getTaskFromPath(goodPath, getTaskFromPathCallback); 
  }
  document.getElementById('form1').style.display ='block';
}

/**
 * @funciton getTaskFromPath
 * @description Returns an object with the data in a task instruction, given a string containing the path to the task in the database.
 * @param {*} taskPath The path to the task in the database.
 * @param {*} callback The function to run once the task is retrieved.
 */
function getTaskFromPath(taskPath, callback){
  var listOfTasks = "";
  var fbGet= firebase.database().ref(taskPath)   //Get all the task categories
  fbGet.once('value', function(snapshot){
      var taskDef = snapshot.val();
      if (taskDef != null){
          callback(taskDef);
      } else {
          //TODO: Failure routine
      }
      return;
  });
}

/**
 * @function getTaskFromPathCallback
 * @param {*} task 
 */
function getTaskFromPathCallback(task){
  getCategories(categories, task, populateArray);
  //populateArray(task);
  //(categories);
  injectToDOM();
}

/**
 * @function getCategories
 * @description Finds all the categories of tasks in the database, and places the options in an array.
 * @param categories - Array to be filled
 * @param task - Task (to put into the callback function, not strictly necessary, but makes the flow of data more apparent)
 * @param callback Function to perform after finding all categories
 */
function getCategories(categories, task, callback){
  var count = 0;
  var fbGet= firebase.database().ref("TaskInstruction")   //Get all the task categories
  fbGet.once('value', function(snapshot){
      snapshot.forEach(function(catSnap){
          if (catSnap.numChildren()){
              categories[count] = catSnap.key;
              count++;
          }
      });
      callback(task);
      return;
  });
}

/**
 * @function populateArray
 * @description Take data from a task snapshot and put it into an array. This is done so that changes to the database
 *              don't cause the need for major change in the task editor code.
 * @param {*} task Snapshot of the task to put into the editor.
 */
function populateArray(task){
  var counter = 1;
  //var steps=[];
  var taskData = {
      category: task["Info"]["Category"],
      outline: task["Info"]["OutlineIOS"],
      videoURL: task["Info"]["videoURL"],
      note: task["Info"]["NoteIOS"],
      name: task["Info"]["Title"],
      owner: task["Info"]["Owner"],
      taskID: task["TaskID"],
      visible: task["Info"]["Visible"],
      published: task["Info"]["Published"],
      startCategory: task["Info"]["Category"],
      newTask: false
  }
  if (taskData["videoURL"] == "null") {
      taskData["videoURL"] = "";
  }
  taskDetails = taskData;

  //If visiblity and published aren't set, set them now
  if (taskDetails["published"] == null){
      taskDetails["published"] = false;
  }
  if (taskDetails["visible"] == null){
      taskDetails["visible"] = false;
  }
  

  //(taskData);
  while (true){   // Loop through the steps
      var stepF = "Step"+counter;
      if ( task["Step"+counter] != null ){
          var detailedSteps = [];
          var detailedCounter;
          detailedCounter = 1;

          //Get information about the detailed steps
          while (true){   // Loop through the detailed steps
              if (task["Step"+counter]["DetailedStep"+detailedCounter] != null){
                  detailedSteps[detailedCounter-1] = task["Step"+counter]["DetailedStep"+detailedCounter];
              } else {
                  break;
              }
              detailedCounter++;
          }
          var detailedStepsJSON = JSON.stringify(detailedSteps);

          var stepsData = {
              description: task[stepF]["MDescriptionIOS"],
              name: task[stepF]["MtitleIOS"],
              number: task[stepF]["Step"],
              image: defImage,
              imageChanged: false,
              detailedSteps: detailedStepsJSON
          }
          //(stepsData);
          steps[counter-1] = stepsData;
          steps[counter-1]['detailedSteps'] = detailedSteps;   
      } else {
          break;
      }
      counter++;
  }
  getStepImage(task, steps, 0);
}

/**
 * @function getStepImage
 * @description Recursively iterates through each step and gets its image. 
 * @param {*} task Details about the task original task.
 * @param {*} steps Task step descriptions
 * @param {*} stepNum The step num whose image is to be received from the database.  This controls the recursion's termination as well.
 */
function getStepImage(task, steps, stepNum){
    
  if (steps[stepNum] == undefined){
      //(steps);
      //("returning at stepNum" + stepNum);
      injectToDOM();
      return;
  }

  var imageLink = task["Step"+(stepNum+1)]["ImageURL"];

  if (imageLink == defImage){
      ////("defImage at step " + stepNum);
      getStepImage(task, steps, stepNum+1);
  } else if (imageLink == null){
      steps["image"] = defImage;
      getStepImage(task, steps, stepNum+1);
  }else if (imageLink.substring(0,6)!="images"){
      //alert("stepNum" + stepNum + " " + imageLink + " " + imageLink.substring(0,6));
      steps[stepNum]["image"] = imageLink;
      getStepImage(task, steps, stepNum+1);
  } else if (imageLink != null){
      //alert("No image @ " + stepNum);
      var storageRef = firebase.storage().ref();
      var imageRef = storageRef.child(imageLink);
      //steps[counter-1]["image"] = 

          imageRef.getDownloadURL().then(function(snapshot){
              //(snapshot);
              imageLink = snapshot;
              steps[stepNum]["image"] = imageLink;
              //(steps);
              //return imageLink;
              getStepImage(task, steps, stepNum+1);
          }).catch(function(err){
              //(err);
              getStepImage(task,steps,stepNum+1);
          });
      
      //promises.push(getImageURL);
  } else {    //image link is null
      steps["image"] = defImage;
      getStepImage(task, steps, stepNum+1);
  }

return;
}

/**
* @function injectToDOM
* @description insert the task editor GUI/HTML into the DOM, display its current state to the page.
*/
function injectToDOM(){
  var htmlInjection;
  //var $AddToDom = $('<div>Task Name: </div>');
  htmlInjection = "";

  htmlInjection += '<br><div style="text-align:left;"><button type="button" onclick="closeclose_form()">Close Task</button></div><br>';
  
  //Task name
  htmlInjection += '<div style="text-align:left;"> Task Name: '+taskDetails["name"]+'</div>';
  
  //Task Category
  htmlInjection += '<div style="text-align:left;"> Category: '+taskDetails["category"]+'</div>';

  //Task Video
  htmlInjection += '<div style="text-align:left;"> Video URL: '+taskDetails["videoURL"]+'</div>';

  //Task outline
  htmlInjection += '<div style="text-align:left;"> Task Outline: '+taskDetails["outline"]+'</div>';
  
  htmlInjection += '<div style="text-align:left;"> Click <button onClick = "showDetails()" type="button">HERE</button> for more details.</div>';
  $("#taskHeader").html(htmlInjection);
  htmlInjection = "";
  // Write the HTML for each individual task step
  for (var i = 0; i < steps.length; i++){
      //Task steps
      htmlInjection += "<div  class = ''>";

      htmlInjection += '<br><div style="flex:3; align-content:left;">' + 'Task Step ' + (parseInt(i)+1) + '</div>';
      //htmlInjection += '<div style="flex:15;"></div>';
      htmlInjection += '</div>';
      htmlInjection += "</div>";
      //Task name
      htmlInjection += "<div class='inputField'>";
      htmlInjection += "<div>Step Name: "+ steps[i].name +"</div>";
      htmlInjection += "</div>";

      //Task description
      htmlInjection += "<div>Step Description: "+ steps[i].description +"</div>";
      htmlInjection += '<div class = "stepImageContainer">';
      //Add in image upload button and image preview
      
      if(steps[i]["image"] != "https://i.imgur.com/d0H6zwB.png") {
        htmlInjection += '<img class="picPreview" name="stepImage' + i + '" src="' + steps[i]["image"] + '"/>';
  }
      htmlInjection += "</div>"   //Close stepImageContainer Div
      htmlInjection += "</div>";  //Close desDevi
      htmlInjection += "</div>";  //Close inputFieldLeft div

      //insert detailed steps
      htmlInjection += getDetailedStepHTML(steps, i);

      htmlInjection += '</div>';   // close taskStep div
  }   //End loop
  
  $("#taskFooter").html(htmlInjection); //Insert the HTML for the tasks into the DOM
}   // end injectToDom

/**
 * @function showDetails
 * @description show task steps
 */
function showDetails() {
  var taskFooter = document.getElementById("taskFooter");
      taskFooter.style.display = "block";
      //.log(taskFooter);
      
}

/**
 * @function getDetailedStepHTML
 * @description return the HTML to render detailed steps to teh DOM
 * @param {*} steps 
 * @param {*} stepNum 
 */
function getDetailedStepHTML(steps, stepNum){
    var i = parseInt(stepNum);
    var detailHTML = "";
    detailHTML += '<div class = "detailedStepContainer">';
    for (var j = 0; j < steps[i]["detailedSteps"].length; j++){ //Loop through the detailed steps, insert them into the page
        detailHTML += '<div class = "detailedStep">';
            
            //Right side of detailed step
            detailHTML += '<div class="detailedStepRightContainer" id= "' + i + '">';
            temp = j+1;
            detailHTML += "<div>Detail Step " + temp +": "+ steps[i]["detailedSteps"][j] +"</div>";
            detailHTML += '</div>';

            detailHTML += '</div>'
    }   
    detailHTML += '</div>'  // End detailed steps
    return detailHTML;
}

/**
 * @function directTask
 * @description
 */
function directTask(){
    var cat = document.getElementById("category").innerHTML;
    var taskN = document.getElementById("taskname").innerHTML;
    sessionStorage.setItem("from","Library.html");
    sessionStorage.setItem("category",cat);
    sessionStorage.setItem("taskname",taskN);
    window.path = "TaskInstruction/" + cat + "/" + taskN;
    localStorage.setItem("taskPath", "TaskInstruction/" + cat + "/" + taskN);
    localStorage.setItem("taskN", taskN);
    //alert("HI" + localStorage.getItem("taskPath"));
    location.href ="/../Frontend-Chinese/06Taskeditor2.html";

}

/**
 * @function showassigntask
 * @description
 */
function showassigntask(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("assigntaskspan").style.opacity = "1";
  document.getElementById("taskhistoryspan").style.opacity = ".8";
}

/**
 * @function showtaskhistory
 * @description
 */
function showtaskhistory(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("assigntaskspan").style.opacity = ".8";
  document.getElementById("taskhistoryspan").style.opacity = "1";
}

/**
 * @function openmenu
 * @description
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
 * @description
 */
function profile(){
  document.getElementById("profile").style.display = "block";
}

/**
 * @function closeprofile
 * @description
 */
function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

/**
 * @function editprofile
 * @description
 */
function editprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "block";
}

/**
 * @function cancelprofile
 * @description
 */
function cancelprofile(){
  window.location.reload()
}

/**
 * @function submitprofile
 * @description
 */
function submitprofile(){

}

/**
 * @function createTaskCopy
 * @description
 */
function createTaskCopy(){
  document.getElementById("library_requestCopy")
  var counter = 0, // counter for checked checkboxes
      i = 0,       // loop variable
      input_obj = document.getElementsByTagName('input');
  // loop through all collected objects
  var checked = [];
  for (i = 0; i < input_obj.length; i++) {
    if (input_obj[i].type === 'checkbox' && input_obj[i].checked === true){
      checked[checked.length] = input_obj[i];
      counter++;
    }
  }

  // display url string or message if there is no checked checkboxes
  if (counter > 0) {
    $("#library_requestCopy").attr("disabled", true);
    copyTask(checked, 0, counter);
  }
  else {
      window.alert('There is no checked checkbox');
  }
}

function copyTask(checked, index, count){

  
  var userID = $("#displayProfileid").html();

  //alert("Index " + index + " count " + count);
  if (index == count){
    $("#library_requestCopy").attr("disabled", false);
    alert("Tasks added to task list");
    return;
  }
  //alert("Index: " + index);
  //Get a copy of the task to be changed
  var num = parseInt(checked[index].name);
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");

  var tCat = tr[num+1].cells[0].innerText;
  var tID = tr[num+1].cells[2].innerText;

  var fbGet= firebase.database().ref('TaskInstruction/'+tCat+"/"+tID);
  fbGet.once("value", function(snapshot){
    var newTask = snapshot.val(); //Create an exact duplicate of the data in the task that was returned

    var postRef = firebase.database().ref('TaskInstruction/LastID');
    //Start the process of getting the new ID
    postRef.transaction(function(data) {
    
      if (data != null){
       
        return (data+1); //If everything is succesful, reinsert the data to the database
      } else {
          return 0; 
      }

    }, function(error, commited, TIDSnap){
      if (error){
        alert("A problem ocurred, aborting task duplication.");
        return;
      }
      if (commited){
        //("hai");
        var TID = TIDSnap.val();
        newTask["TaskID"] = TID;
        newTask["Info"]["Owner"] = $("#displayProfileid").html();
        var insertToDB = {};
        insertToDB["TaskInstruction/"+ newTask["Info"]["Category"] + "/" + parseInt(TID)] = newTask;
        insertToDB["TaskInstruction/"+ newTask["Info"]["Category"] + "/" + parseInt(TID)]["Info"]["Published"] = false;
        insertToDB["TaskInstruction/"+ newTask["Info"]["Category"] + "/" + parseInt(TID)]["Info"]["Visible"] = false;
        //(insertToDB);
        if (firebase.database().ref().update(insertToDB)){
          //("checkpoint");
          //Task is duplicated at this point.  Now it needs to be added to the user's task list.
          //Put the task into the user's task list
          var userID = newTask["Info"]["Owner"];
          //(userID);
          var fbGet= firebase.database().ref("uAccount/"+userID);
          //(fbGet);
          fbGet.once("value",function(snapshot){
            //(snapshot.val());
            var uAccount = snapshot.val();

            if (uAccount["MyTaskList"] == null){  //myTaskList doesn't yet exist
              uAccount["MyTaskList"] = {};
              uAccount["MyTaskList"]["MyListTID1"] = TID;
              uAccount["MyTaskIndex"]={};
              uAccount["MyTaskIndex"]["Number"]=1; 
              //(uAccount);

              //Insert task to my task list.
              firebase.database().ref('uAccount/'+userID).update(uAccount, copyTask(checked, (index+1), count));
    

            } else {  //myTaskList already exists
              //(Object.keys(uAccount["MyTaskList"]).length);
              var num = uAccount["MyTaskIndex"]["Number"] + 1;
              //("NUM"+num); 
              uAccount["MyTaskIndex"]["Number"] = num;
              uAccount["MyTaskList"]["MyListTID" + num] = TID;
              //(uAccount);
              firebase.database().ref('uAccount/'+userID).update(uAccount, copyTask(checked, (index+1), count));
                

            } 
          });

        } else {
          alert("A problem ocurred, aborting task duplication of " + newTask["Info"]["Title"]);
          return;
        }
        //(newTask);
      }
      
    });
  });
}
