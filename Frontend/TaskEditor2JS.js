/* It would be better to use JQuery to generate the HTML for the task steps dynamically rather than generating HTML code in raw strings */
/* This refactoring would make it easier to edit in the future */
var taskDetails=[];
var categories=[];
var steps=[];
var goodPath = "";
var taskSearch = "0000000000000000001";
var a;
var b;
var goodPath = localStorage.getItem("taskPath");
var taskN = localStorage.getItem("taskN");
var defImage = "https://i.imgur.com/d0H6zwB.png";
taskPath = goodPath;
//var goodPath = window.path;

//Start the process of loading the task
if (goodPath == null || goodPath == "newTask"){
    //alert("Creating new task!");
    createNewTask();
} else {
    getTaskFromPath(goodPath, getTaskPathCallback); 
}

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
        //alert(snapshot.val());
        var TID = snapshot.val();
        var userid = localStorage.getItem("userID");
        //alert(userid);
        if (commited){
            //alert(TID);
        
            var taskData = {
                category: "Basic",
                outline: "Type an outline here",
                videoURL: "",
                note: "task note",
                name: "New Task",
                owner: userid,
                taskID: TID,
                visible: false,
                published: false,
                startCategory: "Basic",
                newTask: true
            };
            taskDetails = taskData;
            console.log(taskData);
            var stepsData = {
                description: "step description",
                name: "step name",
                number: 1,
                image: defImage,
                imageChanged: false,
            }
            steps[0] = stepsData;
            steps[0]["detailedSteps"] = [];
            steps[0]["detailedSteps"][0] = "Detailed Step";
            console.log(steps);
        }
        getCategories(categories,task="",function(){injectToDOM();})
    }, true);
}

/**
 * @function getTaskPathCallback
 * @param {*} task 
 */
function getTaskPathCallback(task){
    getCategories(categories, task, populateArray);
    //populateArray(task);
    console.log(categories);
    injectToDOM();
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

    console.log(taskData);
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
 * @function getStepImage
 * @description Recursively iterates through each step and gets its image. 
 * @param {*} task Details about the task original task.
 * @param {*} steps Task step descriptions
 * @param {*} stepNum The step num whose image is to be received from the database.  This controls the recursion's termination as well.
 */
function getStepImage(task, steps, stepNum){
    
    if (steps[stepNum] == undefined){
        console.log("returning at stepNum" + stepNum);
        injectToDOM();
        return;
    }

    var imageLink = task["Step"+(stepNum+1)]["ImageURL"];

    if (imageLink == defImage){
        //console.log("defImage at step " + stepNum);
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
                console.log(snapshot);
                imageLink = snapshot;
                steps[stepNum]["image"] = imageLink;
                console.log(steps);
                //return imageLink;
                getStepImage(task, steps, stepNum+1);
            }).catch(function(err){
                console.log(err);
                getStepImage(task,steps,stepNum+1);
            });
        
        //promises.push(getImageURL);
    } else {    //image link is null
        steps["image"] = defImage;
        getStepImage(task, steps, stepNum+1);
    }

return;
}


$('.sortable').sortable({
    start: function(event, ui){
        a = ui.item.index();
    },
    stop: function(event, ui){
        b = ui.item.index();
        //alert("was: " + a + " is now: " + b);
        var temp;
        temp = steps[a];
        steps[a] = steps[b];
        steps[b] = temp;
        console.log(steps);
        injectToDOM();
        $(".nestedSortable").sortable( {axis:"y"});
    }
});

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
            alert("Task Failed to load")
            Window.location.href("./10Mytask2.html");
            //TODO: Failure routine
        }
        return;
    }, function(error){
        alert("Task failed to load.");
        Window.location.href("./10Mytask2.html")
    });
}

/**
* @function generateStructure()
* @desciprtion generate the array that contains the state of the task being edited.
*/
function generateStructure(){
    for (var i = 0; i < 10; i++){
        var thing = {
            name: "hi " + i,
            description: "hi",
            content: "",
            num: i
        }
        steps[i] = thing;
    }
}

/**
* @function injectToDOM
* @description insert the task editor GUI/HTML into the DOM, display its current state to the page.
*/
function injectToDOM(){
    var htmlInjection;
    //var $AddToDom = $('<div>Task Name: </div>');
    htmlInjection = "";
    //Task name
    htmlInjection += '<div style="text-align:center;"> Task Name: </div>';
    htmlInjection += '<input style="text-align:center;" type="text" id="nameInput" value="' + taskDetails["name"] + '"> </input>';

    //Task Category
    htmlInjection += '<div style="text-align:center;"> Category: </div>';
    htmlInjection += '<select id="category" name="category">';
    console.log(categories);
    for (var c = 0; c < categories.length; c++){
        if (taskDetails.category == categories[c]){
            htmlInjection += '<option value = "' + categories[c] + '" selected="selected">'+ categories[c] + '</option>';
        } else {
            htmlInjection += '<option value = "' + categories[c] + '">'+ categories[c] + '</option>';   
        }
    }

    htmlInjection += '<option value = "new">' + "New Category" + '</option>';


    htmlInjection += '</select>';    // End category input

     //Task Video
     htmlInjection += '<div style="text-align:center;"> Video URL: </div>';
     htmlInjection += '<input style="text-align:center;" type="text" id="videoURLInput" value="' + taskDetails["videoURL"] + '"> </input>';

    //Task outline
    htmlInjection += '<div style="text-align:center;"> Task Outline: </div>';
    htmlInjection += '<div>' + '<textarea class="taskName" id="taskOutline" >' + taskDetails["outline"] + ' </textarea>' + '</div>';

    //Visibility
    htmlInjection += '<div style="text-align:center;"> Task Visibility: </div>';    
    htmlInjection += '<div class="radioField">';
    htmlInjection += '<div class="radioChild">';
    htmlInjection += '<input id="visible"  type="radio" name="status" value="visible"/> Visible';
    htmlInjection += '</div>';

    htmlInjection += '<div class="radioChild">';
    htmlInjection += '<input id="invisible"  type="radio" name="status" value="invisible"/> Invisible';
    htmlInjection += '</div>';

    htmlInjection += '</div>';

    //Visibility
    htmlInjection += '<div style="text-align:center; margin-top:25px;"> Publication Status: </div>'; 

    htmlInjection += '<div class="radioField">';

    htmlInjection += '<div class="radioChild">';
    htmlInjection += '<input id="published"  type="radio" name="visibility" value="published"/> Published';
    htmlInjection += '</div>';  //End Radio chiled

    htmlInjection += '<div class="radioChild">';
    htmlInjection += '<input id="draft"  type="radio" name="visibility" value="draft"/> Draft';
    htmlInjection += '</div>';  //End Radio Child
    
   

    htmlInjection += '</div>';  //End radioField
 

    $("#taskHeader").html(htmlInjection);
    htmlInjection = "";
    // Write the HTML for each individual task step
    for (var i = 0; i < steps.length; i++){
        //Task steps
        htmlInjection += "<div  class = 'taskStep'>";
        htmlInjection += "<div title='Press and hold to drag and reorder steps' class = 'taskStepTop'>";

        htmlInjection += '<div style="flex:3; align-content:left; margin-left:10px; font-size:1.2em;">' + 'Task Step ' + (parseInt(i)+1) + '</div>';
        htmlInjection += '<div style="flex:15;"></div>';
        htmlInjection += '<div style="flex:1;margin-right:8px;"> <button title="Delete main step" class="mainStepDeleteButton" id = " ' + i + '">[X]</button>';
        htmlInjection += '</div>';
        htmlInjection += "</div>";
        //Task name
        htmlInjection += "<div class='inputField'>";
        htmlInjection += "<div>Step name:</div> <input width='80' class = 'stepNameInput' type = 'text' value = '" + steps[i].name + "'id = '" + i + "'</input>";
        htmlInjection += "</div>";

        //Task description
        htmlInjection += "<div class='inputFieldLeft' width='100%'>";
        htmlInjection += "Description: <div class='containerDiv'> <div class='desDiv'> <textarea class = 'stepDescriptionInput' id='" + i + "'>"+ steps[i].description + "</textarea></div>";
        htmlInjection += '<div class = "stepImageContainer">';
        //Add in image upload button and image preview
        htmlInjection += '<input type="file" class="uploadPic" name="'+i+'"/>';
        htmlInjection += '<img class="picPreview" name="stepImage' + i + '" src="' + steps[i]["image"] + '"/>';
        htmlInjection += "</div>"   //Close stepImageContainer Div
        htmlInjection += "</div>";  //Close desDevi
        htmlInjection += "</div>";  //Close inputFieldLeft div

        //insert detailed steps
        htmlInjection += getDetailedStepHTML(steps, i);

        htmlInjection += '</div>';   // close taskStep div
    }   //End loop
    $("#sort").html(htmlInjection); //Insert the HTML for the tasks into the DOM
    htmlInjection = "";
    htmlInjection+= '<button type="button" id="addStep" val="Add Step">Add Step</button>';
    htmlInjection += '<button class="saveButton"> Save Task </button>';
    $("#taskFooter").html(htmlInjection); //Insert the HTML for the tasks into the DOM

    setRadioStartState(taskDetails);
    installEventHandlers(steps, taskDetails);
}   // end injectToDom

/**
 * @function setRadioStartState
 * @description Sets the state of the radio buttons to the state in the task being edited.
 * @param {*} taskDetails The task whose state is being referenced.
 */
function setRadioStartState(taskDetails){
    if (taskDetails["visible"]){
        document.getElementById("visible").checked = true;
    } else {
        document.getElementById("invisible").checked = true;
    }

    if (taskDetails["published"]){
        document.getElementById("published").checked = true;
    } else {
        document.getElementById("draft").checked = true;
    }
}

function installImageHandler(steps, taskDetails){
    $(':file').change(function(event){
        if (this.files && this.files[0]) {

            var id = event.target.name;
            imageFile = this.files[0];
            var reader = new FileReader();
            //reader.onload = imageIsLoaded();
            var fileName = event.target.value;
            reader.onload = function(e){

                //alert('[name="stepImage' + id + '"]');
                $('[name="stepImage' + id + '"]').attr('src', e.target.result);
                steps[id]["image"] = e.target.result;
                steps[id]["imageChanged"] = true;
                steps[id]["jImage"] = imageFile;
                //Process to get file extension
                var filename = event.target.value;  
                var fileExt = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
                steps[id]["fileExt"] = fileExt;
                console.log(steps);
                console.log(steps[id]);
               
             
            }
            reader.readAsDataURL(this.files[0]);
            
            console.log(fileName);
        }
       
    });
}

/**
 * @function installEventHandlers
 * @description Install the event handlers needed for the page to work correctly.
 * @param {*} steps 
 */
function installEventHandlers(steps, taskDetails){
    updateNameHandler(taskDetails);
    updateStepOutlineHandler(taskDetails);
    updateStepNameHandler(steps);
    updateStepDescriptionHandler(steps);
    addStepButtonHandler(steps);
    deleteDetailedStepButtonHandler(steps);
    detailedStepUpButtonHandler(steps);
    detailedStepDownButtonHandler(steps);
    mainStepDeleteButtonHandler(steps);
    newDetailedStepButtonHandler(steps);
    saveButtonHandler(steps);
    updateDetailedStepHandler(steps);
    radioButtonHandler(taskDetails);
    installImageHandler(steps, taskDetails)
    categoryEventHandler(steps, taskDetails);
    updateVideoURLHandler(taskDetails);
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
            //move up/move down buttons
            detailHTML += '<div class="detailedStepButtonContainer" id=' + i + '>';
            detailHTML +=  "<button class='detailedStepUpButton' title='Move detailed step up' id=" + j +   ">▲</button>";
            detailHTML += "<button class='detailedStepDownButton' title='Move detailed step down' id =" + j + ">▼</button>";
            detailHTML += "</div>";
            
            //Right side of detailed step
            detailHTML += '<div class="detailedStepRightContainer" id= "' + i + '">';
            detailHTML += '<input type="text" class = "detailedStepInput" value = "' + steps[i]["detailedSteps"][j] + ' " id= " ' + parseInt(j) +  '"> </input>';
            detailHTML += '</div>';

            //delete button for detailed step
            detailHTML += '<div class="deleteDetailedStepButtonContainer" id= ' + i + '>';
            detailHTML += '<button title="Delete detailed step" class = "deleteDetailedStepButton" id="' + j + '">[X]</button>';
            detailHTML += '</div>';

            detailHTML += '</div>'
    }   
    detailHTML += '<button class = "newDetailedStepButton" style="margin:10px;" id="' + i + '">[+ Add Detailed Step +]</button>';
    detailHTML += '</div>'  // End detailed steps
    return detailHTML;
}

/**
 * @function radioButtonHandler
 * @description Installs the event handler for when the user presses a radio button.  Handles both task visibility and publication status.
 * @param {*} taskDetails Contains the state for the task details.
 */
function radioButtonHandler(taskDetails){
    $('input[type=radio]').click(function(){
        //alert(this.value);
        var val = this.value;
        if (val == "visible"){
            taskDetails["visible"] = true;
        } else if (val == "invisible"){
            taskDetails["visible"] = false;
        } else if (val == "published"){
            taskDetails["published"] = true;
        } else if (val == "draft"){
            taskDetails["published"] = false;
        }
        console.log(taskDetails);
    });
}

/**
 * @function updateDetailedStepHandler
 * @param {*} steps 
 */
function updateDetailedStepHandler(steps){
    $(".detailedStepInput").keyup(function(event){
        var detailedNum = parseInt(event.target.id);
        var mainStepNum = parseInt(event.target.parentElement.id);
        steps[mainStepNum]["detailedSteps"][detailedNum] = $(event.target).val();
    });
}

/**
 * @function updateStepOutlineHandler
 * @param {*} taskDetails 
 */
function updateStepOutlineHandler(taskDetails){
    $( "#taskOutline" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        taskDetails["outline"] = $(event.target).val();
        console.log(taskDetails["outline"]);
    });
}

/**
 * @function updateNameHandler
 * @description Installs event handler for updating the task name. Activates when the user types in the name text field.
 * @param {*} taskDetails Contains the state of the task details. 
 */
function updateNameHandler(taskDetails){
    $( "#nameInput" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        taskDetails["name"] = $(event.target).val();
        console.log(taskDetails["name"]);
    });
}

/**
 * @function updateVideoURLHandler
 * @description Installs event handler for updating the task's video URL.
 * @param {]} taskDetails Conatains the state of the task details
 */
function updateVideoURLHandler(taskDetails){

    $( "#videoURLInput" ).keyup(function(event) {
        taskDetails["videoURL"] = $(event.target).val();
        console.log(taskDetails["videoURL"]);
    });
}

/**
 * @function updateStepNameHandler
 * @description updates the state of the steps array when a user types in a a step's name input box.
 * @param {*} steps 
 */
function updateStepNameHandler(steps){
    //Event handler for updating what's input on step name textboxes.
    $( ".stepNameInput" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        steps[event.target.id].name = $(event.target).val();
    });
}

/**
 * @function updateStepDescriptionHandler
 * @description Update the state of the steps array when a user types in a step's description input box.
 * @param {*} steps 
 */
function updateStepDescriptionHandler(steps){
    $( ".stepDescriptionInput" ).keyup(function(event) {
        steps[parseInt(event.target.id)].description = $(event.target).val();
        console.log(steps[parseInt(event.target.id)]);
    });
}

/**
 * @function addStepButtonHandler
 * @description Adds new step to the steps array when the add step button is pressed.
 * @param {*} steps 
 */
function addStepButtonHandler(steps){
    $( "#addStep").click( function(event){
        //alert("You pressed the button!");
        steps[steps.length] = newStep();
        console.log(steps);
        injectToDOM(steps);
    });
}

/**
 * @function deleteDetailedStepButtonHandler
 * @description Installs event handler for the detailed step delete button.
 * @param {*} steps Contains the state of the steps.
 */
function deleteDetailedStepButtonHandler(steps){
    // Event handler for detailed task delete button
    $( ".deleteDetailedStepButton" ).click (function(event){
        var stepNum;
        var detailedStepNum;
        detailedStepNum = parseInt(event.target.id);
        stepNum = parseInt(event.target.parentElement.id);
        //move every element to the right of this detailed step left
        for (var i = parseInt(detailedStepNum); i < steps[stepNum]["detailedSteps"][detailedStepNum]-1; i++){
            steps[parseInt(stepNum)]["detailedSteps"][parseInt(i)] =  steps[parseInt(stepNum)]["detailedSteps"][parseInt(i)+1];
        }
        steps[stepNum]["detailedSteps"].length -= 1; //Decrease the length of the array to remove the last item

        injectToDOM(steps);
    });
}

/**
 * @function detailedStepUpButton
 * @description Installs event handler for button to move detailed steps up.
 * @param {*} steps Contains the state of the steps.
 */
function  detailedStepUpButtonHandler(steps){
    // Event listener for the button that swaps a detailed step up
    $( ".detailedStepUpButton").click (function(event){
        var detailedStepNum;
        var stepNum;
        detailedStepNum = event.target.id;
        stepNum = event.target.parentElement.id;
      
        if (detailedStepNum > 0){   
            //Swap the detailed steps
            var temp;
            temp = steps[stepNum]["detailedSteps"][detailedStepNum];
            steps[stepNum]["detailedSteps"][detailedStepNum] = steps[stepNum]["detailedSteps"][detailedStepNum-1] ;
            steps[stepNum]["detailedSteps"][detailedStepNum-1] = temp;
            injectToDOM(steps);
        }
    });
}

/**
 * @function detailedStepDownButtonHandler
 * @description Installs event handler for button to move detailed steps down.
 * @param {*} steps Caontains the state of the steps.
 */
function detailedStepDownButtonHandler(steps){
    // Event handler for the button that swaps a detailed step down
    $( ".detailedStepDownButton").click (function(event){
        var detailedStepNum;
        var stepNum;
        detailedStepNum = event.target.id;
        stepNum = event.target.parentElement.id;

        if (detailedStepNum < steps[stepNum]["detailedSteps"].length-1){
            temp = steps[stepNum]["detailedSteps"][detailedStepNum];
            steps[stepNum]["detailedSteps"][detailedStepNum] = steps[stepNum]["detailedSteps"][parseInt(detailedStepNum)+1] ;
            steps[stepNum]["detailedSteps"][parseInt(detailedStepNum)+1] = temp;
            injectToDOM(steps);
        }
    });
}

/**
 * @function mainStepDeleteButtonHandler
 * @description Installs event handler for the button to delete main steps.
 * @param {*} steps Contains the state of the steps.
 */
function mainStepDeleteButtonHandler(steps){
   // Event handler for main task step delete button
   $ ( ".mainStepDeleteButton" ).click(function(event){
    var stepNum;
    stepNum = event.target.id;
    
    for (var i = parseInt(stepNum); i < steps.length-1; i++){
        steps[parseInt(i)] = steps[parseInt(i)+1];
    }
    steps.length -= 1;
    injectToDOM(steps);
});
}

/**
 * @fuction saveButtonHandler
 * @description
 * @param {} steps 
 */
function saveButtonHandler(steps){
    $ (".saveButton").click(function(event){
        
        saveTask(steps, goodPath);
    });
}

/**
 * @function categoryEventHandler
 * @description Update state of the array when the category is changed
 * @param {} steps 
 */
function categoryEventHandler(steps, taskDetails){
    $("#category").change(function(event){
        console.log(event.target.value);
        if (event.target.value == "new"){
            //alert("new");
            $(".newCategoryPopup").css("display","flex");
            $(".newCategoryPopup").css("flex-direction","column");
            var newCategoryTextBox = $('<input>').addClass("catBox").attr("type","text").attr("maxlength","30");
            $(".newCategoryContentContainer").html("Enter custom category name");

            var finishButton = $("<button>").html("Finish").click(function(){
             
                categories[categories.length] = $(".catBox").val();
                taskDetails["category"] = $(".catBox").val();
                console.log(categories);
                console.log(taskDetails);
                $(".newCategoryPopup").css("display","none");
                injectToDOM(steps);
            });
            $(".newCategoryContentContainer").append(newCategoryTextBox);
            $(".newCategoryContentContainer").append(finishButton);
        
            //$(".newCategoryContentContainer").html("Hello world");
            return;
        }
        taskDetails["category"]=event.target.value;
        console.log(taskDetails);
    });
}

/**
 * @function newDetailedStepButtonHandler
 * @description Event handler for the button to create a new detailed step.
 * @param {*} steps 
 */
function newDetailedStepButtonHandler(steps){
    $ (".newDetailedStepButton").click(function(event){
        var stepNum;
        stepNum = event.target.id;
        newDetailedStep(stepNum);
        injectToDOM(steps);
    });
}

/**
 * @function saveTask
 * @description Saves the current state of the task to the database.
 * @param {*} steps Contains the data for the steps
 * @param {*} goodPath The task's path in the database
 * @param {*} taskData Contains the data fields for the task
 */
function saveTask(steps, goodPath, taskData){
 
    insertToDatabase = {};

    insertToDatabase["Info"] = {};
    insertToDatabase["Info"]["Category"] = taskDetails["category"];
    insertToDatabase["Info"]["OutlineIOS"] = taskDetails["outline"];
    if (taskDetails["videoURL"]){
        insertToDatabase["Info"]["videoURL"] = taskDetails["videoURL"];
    } else {
        insertToDatabase["Info"]["videoURL"] = "null";
    }
    //insertToDatabase["Info"]["NoteIOS"] = taskDetails["note"];
    insertToDatabase["Info"]["Title"] = taskDetails["name"];
    insertToDatabase["TaskID"] = taskDetails["taskID"];
 
    insertToDatabase["Info"]["Published"] = taskDetails["published"];
    insertToDatabase["Info"]["Visible"] = taskDetails["visible"];
    insertToDatabase["Info"]["Owner"] = taskDetails["owner"];
    //Generate the structure of the individual steps to insert into the database
    const promises = [];
    for (var i = 0; i < steps.length; i++){
        var tempArray = {};
        insertToDatabase["Step"+(parseInt(i)+1)] = {};
        insertToDatabase["Step"+(parseInt(i)+1)]["MDescriptionIOS"] = steps[i]["description"];
        insertToDatabase["Step"+(parseInt(i)+1)]["MtitleIOS"] = steps[i]["name"];
    
            if (steps[i]["imageChanged"]){
                // Create a root reference
                var storageRef = firebase.storage().ref();

                // Create a reference to 'mountains.jpg'
                var fileExt = steps[i]["fileExt"];

                var imageRef = storageRef.child('images/' + taskDetails["taskID"] + '/' + i + 'stepImage.' + fileExt);
                
                
                var file = steps[i]["jImage"];
                //Warn about redirection while task is saving
                window.onbeforeunload = function() {
                    return "Do you really want to leave this page? Your changes are still saving.";
    
                 };
                const uploadTask = imageRef.put(file).then(function(snapshot, i) {
                    console.log('Uploaded a blob or file!');
                    console.log(snapshot);
                    var path = snapshot["metadata"]["fullPath"];
                    var fileName = snapshot["metadata"]["name"];
                    
                    //Parse the number of the image from the filename that was uploaded
                    //This is used to insert into the insertToDatabase array at the proper step index.
                    var num = parseInt(fileName.substr(0, fileName.indexOf('s'))); 
                    console.log(num);
                    console.log(path);
                    insertToDatabase["Step"+(parseInt(num)+1)]["ImageURL"] = path;
                    console.log(path);
                    //insertToDatabase["Step"+(parseInt(i)+1)]["imageURL"] = 
                  
                });
                promises.push(uploadTask);

            } else {
                insertToDatabase["Step"+(parseInt(i)+1)]["ImageURL"] = steps[i]["image"];
            }
           
        //Generate the structure of the individual detailed steps to insert into the database
        for (var j = 0; j < steps[i]["detailedSteps"].length; j++){
            insertToDatabase["Step"+(parseInt(i)+1)]["DetailedStep"+(parseInt(j)+1)] = steps[i]["detailedSteps"][j];
        }
    }

    Promise.all(promises).then(function(tasks) {
        alert("all image uploads complete.");
        console.log(insertToDatabase);
        var updates = {};
        //updates[goodPath] = insertToDatabase;
        updates[taskDetails["taskID"]] = insertToDatabase;
        console.log(updates);
    
        if (firebase.database().ref("TaskInstruction/"+taskDetails["category"]+"/"+taskDetails["taskID"]).update(insertToDatabase)){   //Actually uploads the task to the database
            localStorage.setItem("taskPath", "TaskInstruction/"+taskDetails["category"]+"/"+taskDetails["taskID"]);
            if (taskDetails["newTask"]){
                addTaskToLibrary();
            }
            if (taskDetails["category"] != taskDetails["startCategory"]){
                console.log("TaskInstruction/" + taskDetails["startCategory"] + "/" + taskDetails["taskID"]);
            
                //If the category changed, delete the old database entry.
                firebase.database().ref().child("TaskInstruction/" + taskDetails["startCategory"] + "/" + taskDetails["taskID"]).remove().then(function(error){
                    console.log("deleted");
                    alert("Save succesful");
                    //Put the task into the library
                    
                });
            } else {
                alert("Save succesful");
                //Disable redirection warning
                window.onbeforeunload = function() {
                    return;
                };
            }

        } else {
            alert("Task failed to save");
            //Disable redirection warning
            window.onbeforeunload = function() {
                return;
             };
        }

    });
}

function addTaskToLibrary(){
    
    //Put the task into tasklist
    console.log("checkpoint");
    //Task is duplicated at this point.  Now it needs to be added to the user's task list.
    //Put the task into the user's task list
    var userID = taskDetails["owner"];
    var TID = taskDetails["taskID"];
    console.log(userID);
    var fbGet= firebase.database().ref("uAccount/"+userID);
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
            firebase.database().ref('uAccount/'+userID).update(uAccount);


        } else {  //myTaskList already exists
            console.log(Object.keys(uAccount["MyTaskList"]).length);
            var num = uAccount["MyTaskIndex"]["Number"] + 1;
            console.log("NUM"+num); 
            uAccount["MyTaskIndex"]["Number"] = num;
            uAccount["MyTaskList"]["MyListTID" + num] = TID;
            console.log(uAccount);
            firebase.database().ref('uAccount/'+userID).update(uAccount);
            
        } 
    }).then(function(){
        //Disable redirection warning
        taskDetails["newTask"] = false;
        window.onbeforeunload = function() {
            return;
        };
    });
}

/**
 * @function newStep
 * @description Return JSON data for the initial state of a new step.
 */
function newStep(){
    var data;
    
    data = {
        description: "description",
        name: "new step",
        image: defImage,
        imageChanged: false,
        number: steps.length
    }
    data.detailedSteps = [];
    
    return data;
}

/**
 * @function newDetailedStep
 * @description adds new generic detail step to the detailedSteps array within the steps array
 * @param {*} stepNum 
 */
function newDetailedStep(stepNum){
    var num = steps[stepNum]["detailedSteps"].length;
    steps[stepNum]["detailedSteps"][ num ] = "Detailed Step";
}