    
function popup_form(){
    document.getElementById("memo_text").value = "";
    document.getElementById("selected_date").value = year+"-"+mm+"-"+dd;
    document.getElementById("form").style.display = "block";
}
function close_form(){
    document.getElementById("form").style.display = "none";
}

function start(){
    var userID = document.getElementById("displayProfileid").innerHTML;
    
    firebase.auth().onAuthStateChanged(function (firebaseUser){
        if(firebaseUser){
            var userid = -1;
            var fbGet= firebase.database().ref('UID');
            fbGet.once('value',function(snapshot){
                var UIDS = snapshot;
                snapshot.forEach(function(newSnap){
                    if (newSnap.key == firebaseUser.uid){
                        userID = newSnap.val();
                        //viewTable(); viewTable is called in setTimeout
                        todayMemo(userID);
                    }
                });
            });
        }
    });
}
window.onload=start;

dateArray = [];
function viewTable() {
    var userID = document.getElementById("displayProfileid").innerHTML;
    var fbCS = firebase.database().ref('MEMO/'+userID);
    fbCS.once('value',function(snapshot){
        snapshot.forEach(function(dates){
            //console.log(dates.val());
            date = dates.key;
            if(date != "MemoIndex"){
                dateArray.push(date);
            }
            //console.log(dateArray);
        });
        injectToDOM(dateArray,userID);
    });
}

function injectToDOM(dateArray,userID){
    var htmlInjection = "";
    count = 0;
  
    //htmlInjection = '<table style="width:100%; border: 1px solid black;">';
    for(var i=0; i<dateArray.length; i++) {
        var fbMemo = firebase.database().ref('MEMO/'+userID+'/'+dateArray[i]);
        fbMemo.once('value',function(snapshot){
            numMemos = snapshot.numChildren();
            var temp = [];
            temp = snapshot.val();
            
            for (key in temp){
                htmlInjection += '<tr>';
                htmlInjection += '<td style="width:15%;">'+snapshot.key+'</td>';
                htmlInjection += '<td style="width:55%;">'+temp[key]+'</td>';
                htmlInjection += '<td style="width:15%"><button id="edit'+key+'" onclick="editMemo(\''+ snapshot.key+'\', \''+key +'\')" style="cursor:pointer;">Edit</button></td>';
                htmlInjection += '<td style="width:15%"><button id="delete'+key+'" onclick="deleteMemo(\''+ snapshot.key+'\', \''+key +'\')" style="cursor:pointer;">Delete</button></td></tr>';

            }
            $("#table_data").html(htmlInjection); //Insert the HTML for the tasks into the DOM
        }); 
    }
} //end injectToDOM

function todayMemo(userID) {
    var newDate = new Date();
    var year = newDate.getFullYear();
    var month = newDate.getMonth() + 1;
    if (month < 10){month = '0'+month;}
    var day = newDate.getDate();
    var dateString = year+'-'+month+'-'+day;
    var text = '';

    //var userID = document.getElementById("displayProfileid").innerHTML;
    var fbTM = firebase.database().ref('MEMO/'+userID+'/'+dateString+'/');
    fbTM.once('value',function(snapshot){
        var memos = snapshot.val();
        //console.log('MEMO/'+userID+'/'+dateString+'/');
        if (memos == null) {
            text = "You have no memos for today.";
        }
        else {
            //console.log(memos);
            for(key in memos){
                text += memos[key] + '<br>';
            }
        }
        //console.log(text);
        $("#today_memo").html(text);
    });
}

function submit(){
    var userID = document.getElementById("displayProfileid").innerHTML;
    var ymd = $("#selected_date").val();
    var memo_text = $("#memo_text").val();

    //create alert message
    var fields = "";
    if(ymd == ""){fields += "Date\n";}
    if(memo_text == ""){fields += "Memo Text\n";}

    if(ymd == "" || memo_text == "" ) {
        alert ("Please enter the following data:\n"+fields);
    }
    
    else {
        var fbGet= firebase.database().ref("MEMO/"+userID);
        fbGet.once("value",function(snapshot){
            var MEMO = snapshot.val();
            console.log(MEMO);
            if (MEMO == null){ //user doesn't have any memos
                var MEMO = {};
                var num = 1;
                console.log(num);
                MEMO["MemoIndex"] = num;
                MEMO[ymd] = {};
                MEMO[ymd]["Memo" + num] = memo_text;
                console.log(MEMO);
                result = firebase.database().ref('MEMO/'+userID).update(MEMO);
                if(result) {location.href ="./03Memo2.html";}
            } 
            else {  //user has memos
                console.log("NO");
                var num = MEMO["MemoIndex"] + 1;
                MEMO["MemoIndex"] = num;
                if(MEMO[ymd] == null) {
                    MEMO[ymd] = {};
                    MEMO[ymd]["Memo" + num] = memo_text;
                }
                else {
                    MEMO[ymd]["Memo" + num] = memo_text; 
                }
                
                console.log(MEMO);
                result = firebase.database().ref('MEMO/'+userID).update(MEMO);
                if(result) {location.href ="./03Memo2.html";}
            } 
        });
    }
} //end function submit


/**
 * @function editMemo
 * @description queries for selected center schedule, calls to fill form
 * @param {*} date selected center schedule to be edited
 */

function editMemo(date, key) {
    var userID = document.getElementById("displayProfileid").innerHTML;
    document.getElementById('edit_form').style.display="block";
    console.log(date);
    var fbB= firebase.database().ref('MEMO/'+userID+'/'+date+'/'+key);
    fbB.on('value', function(memoSnapshot){
      var text = memoSnapshot.val();
      var editButton = '<button onclick="submitEdit(\''+date +'\', \''+ key +'\')" type="button" class="btn">Submit</button>';
      $("#editDate").html(date);
      $("#memoedited").html(text);
      $("#editButtons").html(editButton);
    });
  } //end editMemo

 function submitEdit(date, key){
    var userID = document.getElementById("displayProfileid").innerHTML;
    var text = $("#memoedited").val();
    
    if(text == ""){
        alert ("Please enter data");
    }
    else {
        var r = confirm("Are you sure you want to enter this data?");
        if (r == true) {
            var fbGet = firebase.database().ref("MEMO/"+userID+"/"+date+"/");
            fbGet.once("value",function(snapshot){
                var MEMO = snapshot.val();
                MEMO[key] = text;
                result = firebase.database().ref('MEMO/'+userID+"/"+date+"/").update(MEMO);
                if(result) {
                    close_form();
                    location.href ="./03Memo2.html";
                }
            });   
        }
    }
}

function deleteMemo(date,key) {
    var userID = document.getElementById("displayProfileid").innerHTML;
    var fbB= firebase.database().ref('MEMO/'+userID+'/'+date);
    console.log(date);
    var r = confirm("Are you sure you want to delete this memo?");
    if (r == true) {
        fbB.child(key).remove();
        location.href ="./03Memo2.html";
    } //end if
}

function closeform(){
    document.getElementById("edit_form").style.display="none";
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

var today = new Date();
var dd = today.getDate();
var mm_index = today.getMonth(); //January is 0!
var year = today.getFullYear();
var weekday =  ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var Month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var wk_index = today.getDay();
var d = dd;

var mm = mm_index+1; // to make the month correct; For example: January is 0 , so add 1;
// in order to have same format with "bday". orignal is 2018-9-13
if(mm_index<9){
    var mm = "0"+mm;
}
var nowadays = year +"-"+ mm+"-"+ dd; // 2018-09-13
if (dd<10){
    dd = "0"+dd;
}
var date = mm_index+1;
var year_m = year+"-"+date;
var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();
var num = 0;

var a = new Date();
var hour = a.getHours();
var mon = a.getMonth();
var year = a.getFullYear();

$(document).ready(function() {
    document.getElementById('current_date').innerHTML = dd;
    document.getElementById("current_month").innerHTML = month[mm_index];
    document.getElementById("current_week").innerHTML = weekday[wk_index];
    document.getElementById("current_year").innerHTML = year;
    var userID = document.getElementById("displayProfileid").innerHTML;
});
setTimeout(function(){
    viewTable();
}, 2000);

var time123 = hour+":"+minute+":"+second;

window.onload=function(){
    console.log("HELLO");
      if(time123<"12:00:00" && time123>="04:00:00"){
      document.getElementById("time123").innerHTML = "Good Morning &nbsp ";
    }
    if(time123>="12:00:00" && time123<"18:00:00"){
      document.getElementById("time123").innerHTML = "Good Afternoon &nbsp ";
    }
    if(time123>="18:00:00" || time123<"04:00:00"){
      document.getElementById("time123").innerHTML = "Good Evening &nbsp ";
    }
  }
  
