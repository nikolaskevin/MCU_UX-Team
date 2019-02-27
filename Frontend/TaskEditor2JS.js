
var taskDetails;
var steps=[];
var taskSearch = "0000000000000000001";
var a;
var b;

getTaskPath(taskSearch, getTaskPathCallback);

function getTaskPathCallback(task){
    populateArray(task);
    injectToDOM();
}

function populateArray(task){
    //alert(task['TaskID'])
    var counter = 1;
    //var steps=[];
    var taskData = {
        category: task["Info"]["Category"],
        outline: task["Info"]["OutlineIOS"],
        videoURL: task["Info"]["videoURL"],
        note: task["Info"]["NoteIOS"]
    }
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

var taskPath = "";
var goodPath;
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
                if (taskSnapshot.val()['TaskID'] == taskID){
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
    // Write the HTML for each individual task step
    for (var i = 0; i < steps.length; i++){
        //Task steps
        htmlInjection += "<div class = 'taskStep'>";
        htmlInjection += "Task Step " + (i+1);

        //Task name
        htmlInjection += "<div class='inputField'>";
        htmlInjection += "<div>Step name:</div> <input width='80' class = 'stepNameInput' type = 'text' value = '" + steps[i].name + "'id = '" + i + "'</input>";
        htmlInjection += "</div>";

        //Task description
        htmlInjection += "<div class='inputField' width='100%'>";
        htmlInjection += "Description: <div class='containerDiv'> <textarea class = 'stepDescriptionInput'  id=" + i + ">" + steps[i].description + "</textarea> </div>";
        htmlInjection += "</div>";

        //Detailed steps
        htmlInjection += '<div class = "detailedStepContainer">';
    
        for (var j = 0; j < steps[i]["detailedSteps"].length; j++){ //Loop through the detailed steps, insert them into the page
            htmlInjection += '<div class = "detailedStep">';
                //move up/move down buttons
                htmlInjection += '<div class="detailedStepButtonContainer">';
                htmlInjection +=  "<button class='detailedStepButton'>▲</button>";
                htmlInjection += "<button class='detailedStepButton'>▼</button>";
                htmlInjection += "</div>";
           

                //Right side of detailed step
                htmlInjection += '<div class="detailedStepRightContainer">';
                htmlInjection += steps[i]["detailedSteps"][j];
                htmlInjection += '</div>';

            htmlInjection += '</div>'
        }   
        htmlInjection += '</div>'  // End detailed steps

        //Delete button on main step
       // htmlInjection += '<button>' + "Delete step " + (i+1) + '</button>';
        htmlInjection += '</div>';   // close taskStep div
    }   //End loop
   
    htmlInjection+= '<button type="button" id="addStep" val="Add Step">Add Step</button>';

   
    //document.writeln('<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>');
    //document.writeln("<script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js' type='text/javascript'></script>");
    //htmlInjection+=    '<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/jquery-ui.min.js" type="text/javascript"></script>';
    $("#sort").html(htmlInjection);

    
    //Event handler for updating what's input on step name textboxes.
    $( ".stepNameInput" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        steps[event.target.id].name = $(event.target).val();
        console.log(steps[event.target.id]);
    });

    // Event handler for updating what's input on the step description textboxes.
    $( ".stepDescriptionInput" ).keyup(function(event) {
        //alert( "Handler for .keyup() called." + event.target.id );
        steps[event.target.id].description = $(event.target).val();
        console.log(steps[event.target.id]);
    });

    $( "#addStep").click( function(event){
        //alert("You pressed the button!");
        steps[steps.length] = newStep();
        console.log(steps);
        injectToDOM(steps);
    });
}   // end injectToDom

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

function makeTaskBlock(){
    var retStr = "";
    retStr += "<div class = 'taskStep'>";
    retStr += "<div";
}


