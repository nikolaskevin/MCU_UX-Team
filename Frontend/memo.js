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
     if(second<10){
         second = "0"+second;
     }
     if(hour<10){
         hour = "0"+hour;
     }
     if(minute<10){
         minute = "0"+minute;
     }
    var time = hour+":"+minute+":"+second;
     console.log(time);


function popup_form(){
    document.getElementById("memo_text").value = "";
    document.getElementById("selected_date").value = year+"-"+mm+"-"+dd;
    document.getElementById("form").style.display = "block";
}
function close_form(){
    document.getElementById("form").style.display = "none";
}

function submit(){
    var userID = document.getElementById("displayProfileid").innerHTML;
    var text = $("#memo_text").val();
    var ymd = $("#selected_date").val();
    var a = ymd.split("-");
    a[0] = parseInt(a[0]);
    var maxYear = year+100;
    if(a[1]<10){
        a[1] = a[1].replace('0', '');
    }
    year_m = a[0]+"-"+a[1];
    dd = a[2];
    if(text == ""){
      alert ("Please enter data");
    }
    if(a[0]>maxYear){
        alert("The year entered has exceeded one hundred years!");
    }

    else {
      var r = confirm("Are you sure you want to enter this data?");
      if (r == true) {
        firebase.database().ref("MEMO/"+userID+"/"+year_m+"/"+dd+"-"+time).set(text);
        close_form();
        location.reload();
      }
  }
}



function viewTable(value){
    var userID = document.getElementById("displayProfileid").innerHTML;
    document.getElementById("years").innerHTML = year;
    var a = year_m.split("-");

    if(value == "last"){
        a[1] = a[1]-1;
        if(a[1]== 0){
            a[1] = 12;
            a[0] = a[0]-1;
        }
        year_m = a[0]+"-"+a[1];
        document.getElementById("context_table").innerHTML = "";

    }
    if(value == "next"){
        a[1] =  parseInt(a[1]) +1;
        if(a[1]==13){
        a[1] = 1;
        a[0] = parseInt(a[0]) +1;
        }
        year_m = a[0]+"-"+a[1];
        document.getElementById("context_table").innerHTML = "";
    }

    document.getElementById("years").innerHTML = a[0];
    document.getElementById("fullName_Month").innerHTML = Month[a[1]-1];


    var fbMemo = firebase.database().ref("MEMO/"+userID+"/"+year_m);

    fbMemo.once("value")
    .then(function(snapshot){
        var array = [];
        var array_val = [];
        var index = 0;
        var ol = document.createElement("ol");
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var button = document.createElement("button");
            var button2 = document.createElement("button");
            array.push(childKey);
            button2.innerHTML="Delete";
            button.innerHTML="Edit";
            var arr = childKey.split("-");
            if(value ==null){
                if(arr[0]==dd){
                    var todayMemo = document.getElementById("today_memo");
                      var li = document.createElement("li");
                     // li.setAttribute("type","I");
                      li.appendChild(document.createTextNode(childData));
                      ol.appendChild(li);
                      todayMemo.appendChild(ol);
                }
            }
            var contextTable = document.getElementById("context_table");
            var row = contextTable.insertRow(0);
            var celldate = row.insertCell(0);
            var celleventDate = row.insertCell(1);
            //var cellButton = row.insertCell(2);
            var cellButton2 = row.insertCell(2)

            //$(row).css("border", "1px solid");
            //$(row).css("border-color", "black");
            $(celldate).css("min-width", "80px");
            //$(celldate).css("border-right", "1px solid");
            $(celleventDate).css("word-wrap", "break-word");
            $(celleventDate).css("max-width", "420px");
            //$(celleventDate).css("border-right", "1px solid");
            //$(cellButton).css("min-width", "40px");
            celleventDate.setAttribute("id","content_id["+num+"]");
            celleventDate.setAttribute("onclick","editha("+num+")");
            cellButton2.setAttribute("onclick","deleteha("+num+")");
            //cellButton.setAttribute("onclick","editha("+num+")");
            num++;
            celldate.appendChild(document.createTextNode(arr[0]));
            celleventDate.appendChild(document.createTextNode(childData));
            cellButton2.appendChild(button2);
            //cellButton.appendChild(button);
        })
    })

}

function deleteha(num){
    var userID = document.getElementById("displayProfileid").innerHTML;
    var fbCS= firebase.database().ref('MEMO/'+userID+"/"+year_m);
    fbCS.once("value")
        .then(function(mdelete){
            mdelete.forEach(function(deletememo){
                var memekey=deletememo.key;
                var memodata= deletememo.val();
                var content = document.getElementById('content_id['+num+']').innerHTML;
                    if (memodata == content ){
                        var r = confirm("Are you sure you want to delete a memo ?");
                        if(r == true){
                           fbCS.child(memekey).remove();
                        alert("successfully deleted!");
                            window.location.reload();
                        }
                    }
        })
    })
}

function editha(num){
    var userID = document.getElementById("displayProfileid").innerHTML;
    var Fbe= firebase.database().ref('MEMO/'+userID+"/"+year_m);
    var path1 = 'MEMO/'+userID+"/"+year_m;
    console.log(nowadays);

    Fbe.once('value')
    .then(function(medit){
        medit.forEach(function(editmemo){
            var editmemekey = editmemo.key;
            var editmemodata = editmemo.val();
            var content = document.getElementById('content_id['+num+']').innerHTML;
            sessionStorage.setItem("key",editmemekey);
            sessionStorage.setItem("path", path1);
            if (editmemodata==content){
                console.log(year_m);
                var timeKey = editmemekey.split("-");
                var editDate = year_m+"-"+timeKey[0];
                 document.getElementById('edit_form').style.display="block";
                 document.getElementById('memoedited').value=content;
                 document.getElementById('edited_date').value = editDate;
             }
         })
     })
 }


 function esubmit(){
     var userID = document.getElementById("displayProfileid").innerHTML;
     var text = $("#memoedited").val();
     var ymd = $("#edited_date").val();
     var fb = sessionStorage.getItem('path');
     var key = sessionStorage.getItem('key');
     var a = ymd.split("-");
     if(a[1]<10){
         a[1] = a[1].replace('0', '');
     }

     year_m = a[0]+"-"+a[1];
     dd = a[2];

     if(text == ""){
       alert ("Please enter data");
     }
     else {
       var r = confirm("Are you sure you want to enter this data?");
       if (r == true) {
         firebase.database().ref(fb).child(key).remove();
         firebase.database().ref("MEMO/"+userID+"/"+year_m+"/"+dd+"-"+time).set(text);
         close_form();
         location.reload();
       }
   }
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



var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();

var time = hour+":"+minute+":"+second;


$(document).ready(function() {
    document.getElementById("fullName_Month").innerHTML = Month[mm_index];
    document.getElementById('current_date').innerHTML = dd;
    document.getElementById("current_month").innerHTML = month[mm_index];
    document.getElementById("current_week").innerHTML = weekday[wk_index];
    document.getElementById("current_year").innerHTML = year;
    var userID = document.getElementById("displayProfileid").innerHTML;


});
setTimeout(function(){
    viewTable();
}, 2000);
