/**
 * @file HelpandSupport.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */


var feedback = [];
var goodPath = "";
var fbGet = firebase.database().ref('Feedback/unique_ID');



/**
 * @function getFeedback
 * @description Finds all the data from the feedback node and stores it in an array called feedback[]
 * @param categories - Array to be filled
 * @param feedbackData - feedback (to put into the callback function, not strictly necessary, but makes the flow of data more apparent)
 * @param callback Function to perform after finding all categories
 */
function getFeedback(callback){
    var count = 0
    fbGet.on('value',function(snapshot){
        snapshot.forEach(function(snapshot){
            feedback[count] = snapshot.key;
            count++;
            console.log(count);
            console.log(feedback);
            
        })
        //callback(feedback);
        return;
    });
}
//console.log(getFeedback());


/**
 * @function loadStaffFeedback
 * @description Loads the information from the firebase array into the table. Var staff is assigned to the firebase values and then each following
 * var is assigned to the subquential node
 */
function loadStaffFeedback(){
    $(".staffTable").html("table");

    var table = $('<table>').addClass('staffFeedback');
    var fbGet = firebase.database().ref('Feedback/unique_ID');
    fbGet.on('value', function(snapshot){
        console.log(snapshot.val());

        var staff = snapshot.val();
        //console.log(staff);
        var row = $('<tr>').addClass('staffFeedbackRow');

        var userEmail = staff["userEmail"];
        var userId = staff["userId"];
        var feedbackText = staff["feedbackText"];
        var feedbackReply = staff["replyText"];

        var userEmailCell = $('<td>').addClass('staffFeedback');
            userEmailCell.html(userEmail);

        var userIdCell = $('<td>').addClass('staffFeedback');
            userIdCell.html(userId);

        var userTextCell = $('<td>').addClass('staffFeedback');
            userTextCell.html(feedbackText);
        
        var userReplyCell = $('<td>').addClass('staffFeedback');
            userReplyCell.html(feedbackReply);

        //Add Each Cell to each row
        row.append(userEmailCell, userIdCell, userTextCell, userReplyCell);
        //row.append(userIdCell);
        table.append(row);

        console.log(userEmail);
        console.log(userId);
        console.log(feedbackReply)

        /* DO NOT DELETE MIGHT NEED FOR LATER USE
        snapshot.forEach(function(snapshot){
            var staff = snapshot.val();
            console.log(staff);
            var row = $('<tr>').addClass('staffFeedbackRow');

            var userEmail = staff["Feedback"]["userEmail"];
            var userId = staff["userId"];

            var userEmailCell = $('<td>').addClass('staffFeedback');
                userEmailCell.html(userEmail);

            //Add Each Cell to each row
            row.append(userEmailCell);
            table.append(row);
        console.log(userName);
        });
        */
        $(".staffTable").html(table);
    });
}
console.table(loadStaffFeedback());


function loadFamilyFeedback(){
    $(".familyTable").html("table");

    var table = $('<table>').addClass('familyFeedback');
    var fbGet = firebase.database().ref('Feedback/unique_ID');
    fbGet.on('value', function(snapshot){
        console.log(snapshot.val());

        var staff = snapshot.val();
        //console.log(staff);
        var row = $('<tr>').addClass('familyFeedbackRow');

        var userEmail = staff["userEmail"];
        var userId = staff["userId"];
        var feedbackText = staff["feedbackText"];
        var feedbackReply = staff["replyText"];

        var userEmailCell = $('<td>').addClass('familyFeedback');
            userEmailCell.html(userEmail);

        var userIdCell = $('<td>').addClass('familyFeedback');
            userIdCell.html(userId);

        //var userTextCell = $('<td>').addClass('familyFeedback');
            //userTextCell.html(feedbackText);
        
        var userReplyCell = $('<td>').addClass('familyFeedback');
            userReplyCell.html(feedbackReply);

        //Add Each Cell to each row
        row.append(userEmailCell, userIdCell/*, userTextCell*/, userReplyCell);
        //row.append(userIdCell);
        table.append(row);

        console.log(userEmail);
        console.log(userId);
        console.log(feedbackReply);

        /* DO NOT DELETE MIGHT NEED FOR LATER USE
        snapshot.forEach(function(snapshot){
            var staff = snapshot.val();
            console.log(staff);
            var row = $('<tr>').addClass('familyFeedbackRow');

            var userEmail = staff["Feedback"]["userEmail"];
            var userId = staff["userId"];

            var userEmailCell = $('<td>').addClass('familyFeedback');
                userEmailCell.html(userEmail);

            //Add Each Cell to each row
            row.append(userEmailCell);
            table.append(row);
        console.log(userName);
        });
        */
        $(".familyTable").html(table);
    });
}
console.log(loadFamilyFeedback())






/**
 * @function populateArray
 * @description Take data from a task snapshot and put it into an array. This is done so that changes to the database
 *              don't cause the need for major change in the task editor code.
 * @param {*} feedback Snapshot of the feedback to put into the editor.
 */
function populateArray(feedback){
    var counter = 1;
    //var steps=[];
    var feedbackData = {
        feedbackText: feedback["unique_ID"]["feedbackText"],
        feedbackType: feedback["unique_ID"]["feedbackType"],
        replyId: feedback["unique_ID"]["replyId"],
        replyText: feedback["unique_ID"]["replyText"],
        userEmail: feedback["unique_ID"]["userEmail"],
        userId: feedback["unique_ID"]["userId"]
    }
}





/**
 * @function getFeedbackFromPathCallback
 * @param {*} task 
 */
function getFeedbackFromPathCallback(feedback){
    getFeedback(feedback, populateArray);
    //populateArray(task);
    //(categories);
    injectToDOM();
}

function injectToDOM(){
    var htmlInjection;
    //var $AddToDom = $('<div>Task Name: </div>');
    htmlInjection = "";
  
    htmlInjection += '<br><div style="text-align:left;"><button type="button" onclick="closeclose_form()">Close Task</button></div><br>';
    
    //Task name
    htmlInjection += '<div style="text-align:left;"> User Name: '+feedback["userName"]+'</div>';
    
    //Task Category
    htmlInjection += '<div style="text-align:left;"> Reply: '+feedback["replyText"]+'</div>';
  
    //Task Video
    htmlInjection += '<div style="text-align:left;"> Time: '+feedback["timestamp"]+'</div>';
  
    //Task outline
    htmlInjection += '<div style="text-align:left;"> User ID: '+feedback["userId"]+'</div>';
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
    }
}  


/**
 * @function showsf
 * @description gets the staff feedback via the tab
 */
function showsf(){
    document.getElementById("container").style.display = "block";
    document.getElementById("container1").style.display = "none";
    document.getElementById("stafffeedbackspan").style.opacity = "1";
    document.getElementById("patientfeedbackspan").style.opacity = ".8";
  }
  
  /**
   * @function showpf
   * @description gets the family(patient) feedback via tab
   */
  function showpf(){
    document.getElementById("container").style.display = "none";
    document.getElementById("container1").style.display = "block";
    document.getElementById("stafffeedbackspan").style.opacity = ".8";
    document.getElementById("patientfeedbackspan").style.opacity = "1";
  }
