var fbTask = firebase.database().ref("TaskInstruction/");
var num = 0;
var checkbox_name = [];
fbTask.once("value")
.then(function(snapshot){
    var array = [];
    var index = 0;
    var a = [];
    var i = 0;
    var y = [];
    var rowIndex = 1;
    var c =0;

    snapshot.forEach(function(childSnapshot1){
        var childKey = childSnapshot1.key;
        a.push(childKey);
       var x = document.getElementById("filterCategory");
       var opt = document.createElement("option");
       opt.text= a[i];
        x.add(opt);
        i = i +1;
        var table = document.getElementById("assigningTask");
        var tr = table.getElementsByTagName("tr");
        childSnapshot1.forEach(function(childSnapshot2){
            var childKey = childSnapshot2.key;
            y.push(childKey);
            var z = document.getElementById("filterTaskList");
            var opt1 = document.createElement("option");
            opt1.text = y[c];
            z.add(opt1);
            var button = document.createElement("button");
            var checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.setAttribute("id", "checkbox_name["+num+"]");
            button.setAttribute("id","button_id["+num+"]");
            button.setAttribute("onclick", "display_Detail("+num+")");
            num = num +1;
            var row = assigningTask.insertRow(-1);
            c++;
            tr[c].style.display = "table-row";
            var cellCategory = row.insertCell(-1);
            cellCategory.appendChild(document.createTextNode(childSnapshot1.key));
            var cellName = row.insertCell(-1);
            cellName.appendChild(document.createTextNode(childSnapshot2.key));
            button.innerHTML="Detail";
            var cellButton= row.insertCell(-1);
            var cellCheckbox = row.insertCell(-1);
            cellButton.appendChild(button);
            cellCheckbox.appendChild(checkBox);
                    })
                })
            })

function toggleTask(source) {
var table = document.getElementById("assigningTask");
var tr = table.getElementsByTagName("tr");
var length = tr.length-1;
console.log(length);
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
function toggleList(source) {
    var table = document.getElementById("assigningList");
    var tr = table.getElementsByTagName("tr");
    var length = tr.length -1;
    console.log(length);
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
function assign(){
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
}
var r = alert("Task have been assigned!");
         if(true)
         {
           window.location.reload();
         }

}


var fbCNA = firebase.database().ref("CNA/");
var n = 0;
fbCNA.once("value")
.then(function(snapshot){
    var array = [];
    var index = 0;
    var i = 0;
    var a =[];

    snapshot.forEach(function(childSnapshot1){
        var childKey = childSnapshot1.key;
        var row = assigningCF.insertRow(-1);
        var checkBox = document.createElement("input");
        var table = document.getElementById("assigningCF");
        var tr = table.getElementsByTagName("tr");
        checkBox.type = "checkbox";
        checkBox.setAttribute("id", "checkbox_CFname["+n+"]");
        n = n+1;
        tr[0].style.display = "table-row";
        tr[n].style.display = "table-row";
        var cellID = row.insertCell(0);
        cellID.appendChild(document.createTextNode(childSnapshot1.key));
        childSnapshot1.forEach(function(childSnapshot2){
            childSnapshot2.forEach(function(childSnapshot3){
                var childKey =childSnapshot3.key;
                var childData = childSnapshot3.val();

                if(childKey == "Name"){
                    var cellName = row.insertCell(0);
                    cellName.appendChild(document.createTextNode(childData));
                }
                if(childKey == "Position"){
                    var cellPosition = row.insertCell(0);
                    cellPosition.appendChild(document.createTextNode(childData));
                    var cellCheckbox = row.insertCell(-1);
                    cellCheckbox.appendChild(checkBox);

                }
            })
        })
    })
})
var fbPAT = firebase.database().ref("Patient/");
fbPAT.once("value")
.then(function(snapshot){
    var array = [];
    var index = 0;
    var i = 0;
    var a = [];
    snapshot.forEach(function(childSnapshot1){
        var childKey = childSnapshot1.key;
        var row = assigningCF.insertRow(-1);
        var checkBox = document.createElement("input");
        var table = document.getElementById("assigningCF");
        var tr = table.getElementsByTagName("tr");
        checkBox.type = "checkbox";
        checkBox.setAttribute("id", "checkbox_CFname["+n+"]");
        //checkBox.setAttribute("unchecked", false);
        n = n+1;
        tr[0].style.display = "table-row";

        tr[n].style.display = "table-row";
        var cellID = row.insertCell(0);
        cellID.appendChild(document.createTextNode(childSnapshot1.key));
        childSnapshot1.forEach(function(childSnapshot2){
            childSnapshot2.forEach(function(childSnapshot3){
                var childKey =childSnapshot3.key;
                var childData = childSnapshot3.val();
                if(childKey == "Name"){
                    var cellName = row.insertCell(0);
                    cellName.appendChild(document.createTextNode(childData));
                }
                if(childKey == "Position"){
                    var cellPosition = row.insertCell(0);
                    cellPosition.appendChild(document.createTextNode(childData));
                    var cellCheckbox = row.insertCell(-1);
                    cellCheckbox.appendChild(checkBox);
                }
            })
        })
    })
})

var fbList_CNA = firebase.database().ref("CNA/");
var fbList_PAT = firebase.database().ref("Patient/");
console.log(fbList_CNA);
console.log(fbList_PAT);

display_List(fbList_CNA);
display_List(fbList_PAT);
var checkBox_index = 0;
var x = 0;
function display_List(fbList){
    fbList.once("value")
    .then(function(snapshot){
        var array = [];
        var index = 0;
        var a = [];
        var i = 0;

        snapshot.forEach(function(childSnapshot1){
            var CF_Name;
                childSnapshot1.forEach(function(childSnapshot2){
                    if(childSnapshot2.key == "Portfolio"){
                        childSnapshot2.forEach(function(childSnapshot3){
                        if( childSnapshot3.key == "Name"){
                            CF_Name = childSnapshot3.val();
                            a.push(CF_Name);
                           var x = document.getElementById("filterNameList");
                           var opt = document.createElement("option");
                           opt.text= a[i];
                            x.add(opt);
                            i = i +1;
                        }
                    })
                }
                    if(childSnapshot2.key == "Task"){
                        childSnapshot2.forEach(function(childSnapshot3){

                            childSnapshot3.forEach(function(childSnapshot4){
                                var childKey = childSnapshot4.key;
                                var path = childSnapshot4.val();
                                var fbExist = firebase.database().ref(path);

                                fbExist.on("value",function(ex){
                                    if(ex.exists()){

                                        var checkBox = document.createElement("input");
                                        checkBox.type = "checkbox";
                                        checkBox.setAttribute("id", "checkbox_id["+checkBox_index+"]");
                                        checkBox_index++;
                                        var table1 = document.getElementById("assigningList");
                                        var tr = table1.getElementsByTagName("tr");

                                        checkBox.setAttribute("checked", true);
                                        var row = assigningList.insertRow(-1);

                                        var cellPosition = row.insertCell(0);
                                        var cellID = row.insertCell(1);
                                        var CFname = row.insertCell(2);
                                        var cellCategory = row.insertCell(3);
                                        var cellName = row.insertCell(4);
                                        var cellCheckbox = row.insertCell(-1);

                                        if(fbList.key == "CNA"){

                                            cellPosition.appendChild(document.createTextNode("CNA"));
                                            x++;
                                            tr[x].style.display = "table-row";
                                        }
                                        else{
                                            cellPosition.appendChild(document.createTextNode("Patient"));
                                            x++;
                                            tr[x].style.display = "table-row";
                                        }
                                        cellID.appendChild(document.createTextNode(childSnapshot1.key));
                                        CFname.appendChild(document.createTextNode(CF_Name));
                                        cellCategory.appendChild(document.createTextNode(childSnapshot3.key));
                                        cellName.appendChild(document.createTextNode(childSnapshot4.key));
                                        cellCheckbox.appendChild(checkBox);
                                    }
                                    else{
                                        console.log("it be removed");
                                        //fbExist.remove();
                                        var fbList_CNA = firebase.database().ref("CNA/");
                                        var fbList_PAT = firebase.database().ref("Patient/");
                                        deleteNotExist(fbList_CNA,path);
                                        deleteNotExist(fbList_PAT,path);
                                    }
                                })
                            })
                        })
                    }
                })
            })
        })
}
function deleteNotExist(fbList,path){
        fbList.once("value")
        .then(function(snapshot){
            var array = [];
            var index = 0;
            var a = [];
            var i = 0;
            snapshot.forEach(function(childSnapshot1){
                var CF_Name;
                    childSnapshot1.forEach(function(childSnapshot2){
                        if(childSnapshot2.key == "Task"){
                            childSnapshot2.forEach(function(childSnapshot3){
                                childSnapshot3.forEach(function(childSnapshot4){
                                    var childKey = childSnapshot4.key;
                                    var childData = childSnapshot4.val();
                                    if(childData == path){
                                        fbList.child(childSnapshot1.key+"/"+"Task/"+childSnapshot3.key+"/"+childSnapshot4.key).remove();
                                    }
                                });
                            });
                        }
                    });
                });
            });
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


    function sortingCF(n){
      var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
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

    function sortingList(n){
      var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
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
              console.log(tr.length);
            var td = tr[i].getElementsByTagName("td")[0];//row i cell number 7
            if(td){
            if (td.innerText == val) {
                tr[0].style.display = "table-row"
                tr[i].style.display =  "table-row";
                document.getElementById("all_checked").checked = false;
                var c = i-1;
                var value = document.getElementById("checkbox_name["+c+"]");
                console.log("checkbox_name["+c+"]");
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
                console.log("checkbox_CFname["+c+"]");
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
    function viewassignedtask(){
        document.getElementById("form").style.display = "block";
    }
    function close_form(){
        document.getElementById("form").style.display = "none";
        document.getElementById("popup_detail").style.display = "none";
    }
    function submit(){
    var table = document.getElementById("assigningList");
    var tr = table.getElementsByTagName("tr");
    var length = tr.length-1 ;
    for(var a = 0, b=1; a < length; a++){
      console.log(table.rows[b].cells[0].innerHTML);
        if(table.rows[b].cells[0].innerHTML  == "CNA"){
            if (document.getElementById("checkbox_id["+a+"]").checked == false){
                console.log("CNA/"+table.rows[b].cells[1].innerHTML+"/Task"+"/"+table.rows[b].cells[3].innerHTML+"/"+table.rows[b].cells[4].innerHTML);
                 var unchecked = firebase.database().ref("CNA/"+table.rows[b].cells[1].innerHTML+"/Task"+"/"+table.rows[b].cells[3].innerHTML+"/"+table.rows[b].cells[4].innerHTML);
                 unchecked.remove();
            }
        }
        if(table.rows[b].cells[0].innerHTML  == "Patient"){
            if (document.getElementById("checkbox_id["+a+"]").checked == false){
                console.log("Patient/"+table.rows[b].cells[1].innerHTML+"/Task"+"/"+table.rows[b].cells[3].innerHTML+"/"+table.rows[b].cells[4].innerHTML);
                 var famunchecked = firebase.database().ref("Patient/"+table.rows[b].cells[1].innerHTML+"/Task"+"/"+table.rows[b].cells[3].innerHTML+"/"+table.rows[b].cells[4].innerHTML);
                 famunchecked.remove();
            }
        }
        b++
    }
    var r = alert("Task have been unassigned!");
             if(true)
             {
               window.location.reload();
             }
}

function closeclose_form(){
    document.getElementById('form1').style.display ='none';
    var Table = document.getElementById("content");
    Table.innerHTML = ""
}
function display_Detail(num){
  document.getElementById('form1').style.display ='block';
  var table = document.getElementById("assigningTask");
  var tr = table.getElementsByTagName("tr");
  var p = document.createElement('p');
  var Ukey = tr[num+1].cells[0].innerText;
  var Ukey1 = tr[num+1].cells[1].innerText;
  var fbTask= firebase.database().ref('TaskInstruction/'+Ukey+"/"+Ukey1);
  //document.getElementById("TaskName").innerHTML = Ukey1;
  console.log(Ukey1);
  var array = [];
  var i = 0;
  fbTask.on('value', function(snapshot){
      document.getElementById("taskname").innerHTML = Ukey1;
      document.getElementById("category").innerHTML = Ukey;

      snapshot.forEach(function(snapshot1){
          console.log(snapshot1.key);
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
function directTask(){
    var cat = document.getElementById("category").innerHTML;
    var taskN = document.getElementById("taskname").innerHTML;
    sessionStorage.setItem("from","Library.html");
    sessionStorage.setItem("category",cat);
    sessionStorage.setItem("taskname",taskN);

    location.href ="/../Frontend/06Taskeditor2.html";

}


function showassigntask(){
  document.getElementById("data1").style.display = "block";
  document.getElementById("data2").style.display = "none";
  document.getElementById("assigntaskspan").style.opacity = "1";
  document.getElementById("taskhistoryspan").style.opacity = ".8";
}

function showtaskhistory(){
  document.getElementById("data1").style.display = "none";
  document.getElementById("data2").style.display = "block";
  document.getElementById("assigntaskspan").style.opacity = ".8";
  document.getElementById("taskhistoryspan").style.opacity = "1";
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
