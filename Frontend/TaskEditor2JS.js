
var taskDetails=[];
var steps=[];
var goodPath = "";
var taskSearch = "0000000000000000001";
var a;
var b;
var goodPath = localStorage.getItem("taskPath");
var taskN = localStorage.getItem("taskN");
taskPath = goodPath;
//var goodPath = window.path;
if (goodPath  == null){
    alert("No valid task chosen from library");
    location.href ="/../Frontend/05Library2.html";
}
getTaskPath(taskSearch, getTaskPathCallback);

function getTaskPathCallback(task){
    populateArray(task);
    injectToDOM();
}

function populateArray(task){

 
    var counter = 1;
    //var steps=[];
    var taskData = {
        category: task["Info"]["Category"],
        outline: task["Info"]["OutlineIOS"],
        videoURL: task["Info"]["videoURL"],
        note: task["Info"]["NoteIOS"]
    }
    taskDetails = taskData;

    console.log(taskData);
    while (true){
        var stepF = "Step"+counter;
        if ( task["Step"+counter] != null ){
            var detailedSteps = [];
            var detailedCounter;
            detailedCounter = 1;

            //Get information about the detailed steps
            while (true){
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
                detailedSteps: detailedStepsJSON
            }
            steps[counter-1] = stepsData;
            steps[counter-1]['detailedSteps'] = detailedSteps;
            console.log(stepsData);
            
        } else {
            break;
        }
        counter++;
    }
}

$('.sortable').sortable({
    start: function(event, ui){
        a = ui.item.index();
    },
    stop: function(event, ui){
        b = ui.item.index();
        alert("was: " + a + " is now: " + b);
        var temp;
        temp = steps[a];
        steps[a] = steps[b];
        steps[b] = temp;
        console.log(steps);
        injectToDOM();
        $(".nestedSortable").sortable( {axis:"y"});
    }
});

//var taskPath = "";
//var goodPath;
//Get task with a certain ID from the database
function getTaskPath(taskID, callback){
    var listOfTasks = "";
    var fbGet= firebase.database().ref('TaskInstruction')   //Get all the task categories

    fbGet.once('value',function(snapshot){  //Get a snapshot of the data in the TaskInstruction part of the database.
        console.log(snapshot.val());
        taskPath = "TaskInstruction";

        // Loop through each of the categories
        snapshot.forEach(function(catSnapshot)  { 
            console.log(catSnapshot.val());
            var cat = catSnapshot.key;
            taskPath = "TaskInstruction/" + cat + "/";

            // Loop through each of the tasks
            catSnapshot.forEach(function(taskSnapshot){
                console.log(taskSnapshot.val());
                var task = taskSnapshot.key;
               // if (taskSnapshot.val()['TaskID'] == taskID){
                if (task == taskN){
                    if (taskSnapshot.val())
                        taskPath += taskSnapshot.key;
                        goodPath = taskPath;
                        callback(taskSnapshot.val()); //callback function after getting the path to the task we're looking for.
                        return;
                    }
                    listOfTasks += "\n" +  task;
            });
        });
        taskPath = "";
    })
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
    
    htmlInjection = "";

    htmlInjection += '<div style="text-align:center;"> Task Outline: </div>';
    htmlInjection += '<div>' + '<textarea class="taskName" >' + taskDetails["outline"] + ' </textarea>' + '</div>';
    $("#taskHeader").html(htmlInjection);
    htmlInjection = "";
    // Write the HTML for each individual task step
    for (var i = 0; i < steps.length; i++){
        //Task steps
        htmlInjection += "<div class = 'taskStep'>";
        htmlInjection += "<div class = 'taskStepTop'>";

        //htmlInjeciton += "<div style = 'flex:10'> </div>";
        htmlInjection += '<div style="flex:3; align-content:left; margin-left:10px; font-size:1.2em;">' + 'Task Step ' + (parseInt(i)+1) + '</div>';
        htmlInjection += '<div style="flex:15;"></div>';
        htmlInjection += '<div style="flex:1;margin-right:8px;"> <button class="mainStepDeleteButton" id = " ' + i + '">[X]</button>';
        htmlInjection += '</div>';
        //htmlInjection += "<div style = 'flex:1'> hi guise </div>";

        htmlInjection += "</div>";
        //Task name
        htmlInjection += "<div class='inputField'>";
        htmlInjection += "<div>Step name:</div> <input width='80' class = 'stepNameInput' type = 'text' value = '" + steps[i].name + "'id = '" + i + "'</input>";
        htmlInjection += "</div>";

        //Task description
        htmlInjection += "<div class='inputField' width='100%'>";
        htmlInjection += "Description: <div class='containerDiv'> <textarea class = 'stepDescriptionInput' id='" + i + "'>"+ steps[i].description + "</textarea> </div>";
        htmlInjection += "</div>";

        //insert detailed steps
        htmlInjection += getDetailedStepHTML(steps, i);

        htmlInjection += '</div>';   // close taskStep div
    }   //End loop
    $("#sort").html(htmlInjection); //Insert the HTML for the tasks into the DOM
    htmlInjection = "";
    htmlInjection+= '<button type="button" id="addStep" val="Add Step">Add Step</button>';
    htmlInjection += '<button class="saveButton"> Save Task </button>';
    $("#taskFooter").html(htmlInjection); //Insert the HTML for the tasks into the DOM

    installEventHandlers(steps, taskDetails);
}   // end injectToDom


/**
 * @function installEventHandlers
 * @description Install the event handlers needed for the page to work correctly.
 * @param {*} steps 
 */
function installEventHandlers(steps, taskDetails){
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
    updateDetailedStepHandler(steps)
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
            detailHTML +=  "<button class='detailedStepUpButton' id=" + j + ">▲</button>";
            detailHTML += "<button class='detailedStepDownButton' id =" + j + ">▼</button>";
            detailHTML += "</div>";
            
            //Right side of detailed step
            detailHTML += '<div class="detailedStepRightContainer" id= "' + i + '">';
            detailHTML += '<input type="text" class = "detailedStepInput" value = "' + steps[i]["detailedSteps"][j] + ' " id= " ' + parseInt(j) +  '"> </input>';
            detailHTML += '</div>';

            //delete button for detailed step
            detailHTML += '<div class="deleteDetailedStepButtonContainer" id= ' + i + '>';
            detailHTML += '<button class = "deleteDetailedStepButton" id="' + j + '">[X]</button>';
            detailHTML += '</div>';

            detailHTML += '</div>'
    }   
    detailHTML += '<button class = "newDetailedStepButton" style="margin:10px;" id="' + i + '">[+]</button>';
    detailHTML += '</div>'  // End detailed steps
    return detailHTML;
}

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
    $( ".taskName" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        taskDetails["outline"] = $(event.target).val();
        console.log(taskDetails["outline"]);
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

function saveButtonHandler(steps){
    $ (".saveButton").click(function(event){
        
        saveTask(steps, goodPath);
    });
}

function newDetailedStepButtonHandler(steps){
    $ (".newDetailedStepButton").click(function(event){
        var stepNum;
        stepNum = event.target.id;
        newDetailedStep(stepNum);
        injectToDOM(steps);
    });
}

function saveTask(steps, goodPath, taskData){
    insertToDatabase = {};

    insertToDatabase["Info"] = {};
    insertToDatabase["Info"]["Category"] = taskDetails["category"];
    insertToDatabase["Info"]["OutlineIOS"] = taskDetails["outline"];
    insertToDatabase["Info"]["videoURL"] = taskDetails["videoURL"];
    insertToDatabase["Info"]["NoteIOS"] = taskDetails["note"];
    insertToDatabase["TaskID"] = taskSearch;
    for (var i = 0; i < steps.length; i++){
        var tempArray = [];
        insertToDatabase["Step"+(parseInt(i)+1)] = {};
        insertToDatabase["Step"+(parseInt(i)+1)]["MDescriptionIOS"] = steps[i]["description"];
        insertToDatabase["Step"+(parseInt(i)+1)]["MtitleIOS"] = steps[i]["name"];
        for (var j = 0; j < steps[i]["detailedSteps"].length; j++){
            insertToDatabase["Step"+(parseInt(i)+1)]["DetailedStep"+(parseInt(j)+1)] = steps[i]["detailedSteps"][j];
        }
    }
    var str = JSON.stringify(insertToDatabase);
    
    console.log(str);
    console.log(insertToDatabase);
    var updates = {};
    updates[goodPath] = insertToDatabase;
    firebase.database().ref().update(updates);
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




