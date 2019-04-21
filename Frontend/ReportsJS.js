/**
 * @file ReportsJS.js
 * @author  MCU
 * @author  Kutztown University
 * @license
 */

var fbPatName = firebase.database().ref("Patient");
	
	//grab the Patient's name from database and put into the selected box
	fbPatName.once("value")
    .then(function(snapshot){
        var array = [];
        var index = 0;
        snapshot.forEach(function(childSnapshot){			
          var childKey = childSnapshot.key;
		  
			var fbPatName = firebase.database().ref("Patient/"+childKey+"/Portfolio");
		  	fbPatName.once("value")
			.then(function(snapshot){
        var firstName = snapshot.child("/Name").val();
				
			 if(childSnapshot.key = "Portfolio/Name"){
              array.push(firstName); // add the childkey into array, push is add
              var x = document.getElementById("selectPatName");
              var opt = document.createElement("option");
              opt.text= array[index];
              x.add(opt);
              index=index+1;
          }

	    });
       });
    });
	
    
   // Finds the PatientID based of choosen PatientName
   function selectPatientName(){
    var nameVal = document.getElementById("selectPatName").value;
    var nameRef = firebase.database().ref('Patient');
    var startD = document.getElementById("startDate").value;
    var endD = document.getElementById("endDate").value;


    nameRef.orderByChild('Portfolio/Name/').equalTo(nameVal).on("value", function(snapshot) {
        snapshot.forEach((function(child) { document.getElementById("patientID").value = child.key; 
        
        if(startD != "" &&  endD != ""){
        document.getElementById("generate_report_button").disabled = false;
        document.getElementById("generate_report_button").style.backgroundColor ='#F5F5F5';
        }
    }));
});

    if (document.getElementById("selectPatName").value == "Patient Name"){
             document.getElementById("patientID").value = "";
             document.getElementById("generate_report_button").disabled = true;
             document.getElementById("generate_report_button").style.backgroundColor ='#A9A9A9';

    }


   }

	
// clear box function
    function clearBox()
{
    document.getElementById("patientID").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("selectPatName").value = "Patient Name";
}

// fast day report button function
function fastDay() {
  document.getElementById("day_button").onclick = function() {
      var startDate = new Date();
      startDate.setDate( startDate.getDate() - 1 );

     var startDay = startDate.getDate();
     var startMonth= startDate.getMonth() + 1; //January is 0!
     var startYear = startDate.getFullYear();

     if (startDay < 10) {
        startDay = '0' + startDay;
      }
      if (startMonth < 10) {
        startMonth = '0' + startMonth;
      }

      var endDate = new Date();
      var endDay = endDate.getDate();
      var endMonth= endDate.getMonth() + 1; //January is 0!
      var endYear = endDate.getFullYear();

      if (endDay < 10) {
        endDay = '0' + endDay;
      }
      if (endMonth < 10) {
        endMonth = '0' + endMonth;
      }

      var completeStartDate = startYear+ '-' + startMonth + '-' + startDay;
      var completeEndDate = endYear+ '-' + endMonth + '-' + endDay;

      document.getElementById("startDate").value = completeStartDate;  // today
      document.getElementById("endDate").value = completeEndDate;  // today

 };
}

// fast week report button function
function fastWeek() {
    document.getElementById("week_button").onclick = function() {
        var startDate = new Date();
        startDate.setDate( startDate.getDate() - 7 );
  
       var startDay = startDate.getDate();
       var startMonth= startDate.getMonth() + 1; //January is 0!
       var startYear = startDate.getFullYear();
  
       if (startDay < 10) {
          startDay = '0' + startDay;
        }
        if (startMonth < 10) {
          startMonth = '0' + startMonth;
        }
  
        var endDate = new Date();
        var endDay = endDate.getDate();
        var endMonth= endDate.getMonth() + 1; //January is 0!
        var endYear = endDate.getFullYear();
  
        if (endDay < 10) {
          endDay = '0' + endDay;
        }
        if (endMonth < 10) {
          endMonth = '0' + endMonth;
        }
  
        var completeStartDate = startYear+ '-' + startMonth + '-' + startDay;
        var completeEndDate = endYear+ '-' + endMonth + '-' + endDay;
  
        document.getElementById("startDate").value = completeStartDate;  // today
        document.getElementById("endDate").value = completeEndDate;  // today
  
   };
  }

  // fast day report button function
function fastMonth() {
    document.getElementById("month_button").onclick = function() {
        var startDate = new Date();
        startDate.setDate( startDate.getDate() - 30 );
  
       var startDay = startDate.getDate();
       var startMonth= startDate.getMonth() + 1; //January is 0!
       var startYear = startDate.getFullYear();
  
       if (startDay < 10) {
          startDay = '0' + startDay;
        }
        if (startMonth < 10) {
          startMonth = '0' + startMonth;
        }
  
        var endDate = new Date();
        var endDay = endDate.getDate();
        var endMonth= endDate.getMonth() + 1; //January is 0!
        var endYear = endDate.getFullYear();
  
        if (endDay < 10) {
          endDay = '0' + endDay;
        }
        if (endMonth < 10) {
          endMonth = '0' + endMonth;
        }
  
        var completeStartDate = startYear+ '-' + startMonth + '-' + startDay;
        var completeEndDate = endYear+ '-' + endMonth + '-' + endDay;
  
        document.getElementById("startDate").value = completeStartDate;  // today
        document.getElementById("endDate").value = completeEndDate;  // today
  
   };
  }

// Updates the database with the data used for the python script that
// generates the actual report and places it on the server.
// Displays a URL link to where the report can be found.
function generateReport(){
var startDate = document.getElementById("startDate").value; 
var endDate = document.getElementById("endDate").value;
var patientID = document.getElementById("patientID").value; 
var name = document.getElementById("selectPatName").value;
var rURL = "http://acad.kutztown.edu/~nperu898/" + name + "_" + startDate + "_" + endDate + ".pdf";
var Success = "false";




  firebase.database().ref('Reports/StartDate/').set(startDate);
  firebase.database().ref('Reports/EndDate/').set(endDate);
  firebase.database().ref('Reports/IDvalue/').set(patientID);
  firebase.database().ref('Reports/ReportLink/').set(rURL);
  firebase.database().ref('Reports/Success/').set(Success);

  var stringURL = rURL;
  var HLReport = stringURL.link(rURL);


  var successRef = firebase.database().ref('Reports');



document.getElementById("ReportURL").innerHTML = "Please wait a moment while your report is generated.";



console.log(Success);

    function check() {

      var rootRef = firebase.database().ref();
      rootRef.once("value")
        .then(function(snapshot) {
          var Success = snapshot.child("Reports/Success").val(); // "ada"
          console.log(Success);
          if (Success == "true" ){
            document.getElementById("ReportURL").innerHTML = HLReport;
          }
          else {
            document.getElementById("ReportURL").innerHTML = "Report Generation Failed. Please try again or contact support.";
          }});
        };

    setTimeout(check, 20000);

}

window.onload=function(){
// displaying the current date
    var today = new Date();
    
    var dd = today.getDate();
    var mm_index = today.getMonth(); //January is 0!
    var year = today.getFullYear();
    var weekday =  ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
     var wk_index = today.getDay();

   

     if (dd<10){
         dd = "0"+dd;
     }
     document.getElementById('current_date').innerHTML = dd;
     document.getElementById("current_month").innerHTML = month[mm_index];
     document.getElementById("current_week").innerHTML = weekday[wk_index];
     document.getElementById("current_year").innerHTML = year;

     //defaut date is today's  patinet's vital record
     var mm = mm_index+1; // to make the month correct; For example: January is 0 , so add 1;
     // in order to have same format with "bday". orignal is 2018-9-13
     if(mm_index<9){
         var mm = "0"+mm;
     }
    var nowadays = year +"-"+ mm+"-"+ dd; // 2018-09-13

    console.log(nowadays);

    document.getElementById("bday").value = nowadays;
    var a = new Date();
    var hour = a.getHours();
    var minute = a.getMinutes();
    var second = a.getSeconds();

    var time = hour+":"+minute+":"+second;
     console.log(time);


        if(time<"12:00:00" && time>="04:00:00"){
        document.getElementById("time").innerHTML = "Good Morning &nbsp ";
      }
      if(time>="12:00:00" && time<"18:00:00"){
      document.getElementById("time").innerHTML = "Good Afternoon &nbsp ";
    }
      if(time>="18:00:00" || time<"04:00:00"){
    document.getElementById("time").innerHTML = "Good Evening &nbsp ";
    }


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


function profile(){
  document.getElementById("profile").style.display = "block";
}

function closeprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "none";
}

function editprofile(){
  document.getElementById("profile").style.display = "none";
  document.getElementById("editprofile").style.display = "block";
}

function cancelprofile(){
  window.location.reload()
}

function submitprofile(){

}