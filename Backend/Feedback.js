
    var fbFeedback = firebase.database().ref("Feedback/");
    var num = 0;
    fbFeedback.once("value")
    .then(function(snapshot){
        snapshot.forEach(function(childSnapshot1){
            var id = childSnapshot1.key;
            match_id(id,fbFeedback);
       });
    });

function match_id(id,fbFeedback){

    if (id.charAt(0) == "3"){
        var fbCNA = firebase.database().ref("CNA/"+id+"/Portfolio");
        let arr_name = [];
        var name;
        var picture;
        fbCNA.once("value")
           .then(function(snapshot){
               var name;
               var picture;
               snapshot.forEach(function(childSnapshot1){
                   if(childSnapshot1.key == "Name"){
                       name = childSnapshot1.val();
                   }
                   if(childSnapshot1.key =="pictureurl"){
                       picture = childSnapshot1.val();
                       tableform(id,name,fbFeedback,picture);
                   }
               })
           });
    }
    else{
        var fbPAT = firebase.database().ref("Patient/"+id+"/Portfolio");
        let arr_name = [];
        var name;
        fbPAT.once("value")
           .then(function(snapshot){
               var name;
               var picture;
               snapshot.forEach(function(childSnapshot1){
                   if(childSnapshot1.key == "Name"){
                       name = childSnapshot1.val();
                   }
                   if(childSnapshot1.key =="pictureurl"){
                       picture = childSnapshot1.val();
                       tableform(id,name,fbFeedback,picture);
                   }
               })
           });
    }

}
var index = 0;
function tableform(id,name,fbFeedback,picture){
    fbFeedback.child(id+"/System/").once('value')
    .then(function(childSnapshot2){//System
        childSnapshot2.forEach(function(childSnapshot3 ){//0
            childSnapshot3.forEach(function(childSnapshot4){//Received
              childSnapshot4.forEach(function(childSnapshot5){
                childSnapshot5.forEach(function(childSnapshot6){

                  var m = childSnapshot3.key;
                  var a = m.split("-");
                  var m1 = m.split("-");

                   m1 = m1[0]+"-"+m1[1]+"-"+m1[2];
                  var feedbackID = childSnapshot4.key;
                  feedbackID = feedbackID.split("-");
                  feedbackID = feedbackID[1];
                  var t = childSnapshot6.key;
                  var time = t.split(":");
                  var tim1 = t.split(":");

                  tim1 = tim1[0]+":"+tim1[1]+":"+tim1[2];
                  var value = childSnapshot6.val();
              //  document.getElementById("user-fa").src = "/images/user_info_bg.jpg";
                  var container = document.getElementById('container');
                  var div = document.createElement('div');
                  var span0 = document.createElement("span");
                  var span = document.createElement('span');
                  var span1 = document.createElement('span');
                  var i = document.createElement("i");
                  var img = document.createElement("img");
                  var div1 = document.createElement('div');
                  var span2 = document.createElement('span');
                  var span3 = document.createElement("span");
                  var span4 = document.createElement("span");

                  var span5 = document.createElement("span");

                  var div2 = document.createElement('div');
                  var div3 = document.createElement('div');
                  var input = document.createElement("input");
                  var button = document.createElement("button");
                  div.setAttribute("class", "liuyan");
                  div.setAttribute("id", "liuyan["+index+"]");
                  span0.setAttribute("id","time["+index+"]");
                  span0.setAttribute("class","time");
                  span.setAttribute("id", "user-fa["+index+"]");
                  i.setAttribute("class", "fa fa-user");
                  img.setAttribute("class", "user-fa");
                  img.setAttribute("id", "photo["+index+"]");

                  div1.setAttribute("id","user["+index+"]");
                  span2.setAttribute("id", "comment["+index+"]");
                  span2.setAttribute("class", "comment");
                  span1.setAttribute("id","username["+index+"]");
                  span3.setAttribute("onclick","replyToggle("+index+")");
                  span3.setAttribute("class", "reply");
                  span3.setAttribute("id","reply["+index+"]")
                  span4.setAttribute("id","replyComment["+index+"]");
                  span4.setAttribute("class","replyComment");

                  div2.setAttribute("id" ,"usermessage");
                  div2.setAttribute("class" ,"usermessage");
                  div3.setAttribute("class" ,"content");
                  div3.setAttribute("id" ,"div3ID["+index+"]");

                  input.setAttribute("id", "message["+index+"]");
                  input.setAttribute("class", "text-success");
                  input.setAttribute("type", "text");
                  button.setAttribute("id","btn["+index+"]");
                  button.setAttribute("class", "btn-success");

                  span5.setAttribute("id","replyTime["+index+"]");
                  span5.setAttribute("class","replyTime");


                  button.setAttribute("onclick", "sendMess("+id+","+a[0]+","+a[1]+","+index+","+a[2]+","+time[0]+","+time[1]+","+time[2]+","+feedbackID+")");
                  button.innerHTML= "Enter";
                  span3.innerHTML = "Reply";

                  if(childSnapshot5.key == "Received"){
                      if(id.charAt(0) == "3"){
                          container.appendChild(div);

                          div.appendChild(span);
                          span.appendChild(i);
                          i.appendChild(img);
                          div.appendChild(div1);
                          div1.appendChild(span1);
                          div.appendChild(span2);
                          div.appendChild(span3);
                          div.appendChild(span0);

                          div.appendChild(div2);
                          div2.appendChild(div3);
                          div2.appendChild(span4);
                          div3.appendChild(input);
                          div3.appendChild(button);

                          div.appendChild(span5);



                          document.getElementById("time["+index+"]").innerHTML = m1+"-"+tim1;
                          document.getElementById("photo["+index+"]").src = picture;
                          document.getElementById("username["+index+"]").innerHTML = name +"  said:";
                          document.getElementById("comment["+index+"]").innerHTML = childSnapshot6.val();
                          getReply(id,index,a[0],a[1],a[2],time[0],time[1],time[2],feedbackID);
                          index++;
                      }
                      else{
                          var container1 = document.getElementById("container1");
                          container1.appendChild(div);
                          div.appendChild(span);
                          span.appendChild(i);
                          i.appendChild(img);
                          div.appendChild(div1);
                          div1.appendChild(span1);
                          div.appendChild(span2);
                          div.appendChild(span3);
                          div.appendChild(span0);


                          div.appendChild(div2);
                          div2.appendChild(div3);
                          div2.appendChild(span4);
                          div3.appendChild(input);
                          div3.appendChild(button);

                         div.appendChild(span5);




                          document.getElementById("time["+index+"]").innerHTML = m1+"-"+tim1;
                          document.getElementById("photo["+index+"]").src = picture;
                          document.getElementById("username["+index+"]").innerHTML = name +"  said:";
                          document.getElementById("comment["+index+"]").innerHTML = childSnapshot6.val();

                          getReply(id,index,a[0],a[1],a[2],time[0],time[1],time[2],feedbackID);

                          index++;
                      }
                  }
                })


              })

            })
        })
    });

}
function getReply(id,index,year,month,date,h,m,s,feedbackID){
    console.log("123");
    console.log(feedbackID);
    var fbID = "ID-"+feedbackID;
    var lastDate = year+"-"+month+"-"+date;
    var time = h+":"+m+":"+s;
    var fbReply = firebase.database().ref("Feedback/"+id+"/System"+"/"+lastDate+"/"+fbID+"/Replied/");
    fbReply.once('value').
    then(function(snapshot){
        snapshot.forEach(function(snapshot1){
            var com = snapshot1.val();
            com = com.replace (/[~]/g," ");
            document.getElementById("replyComment["+index+"]").innerHTML = com;
            console.log(com);
            console.log("com");

            var tim = snapshot1.key;
            tim = tim.replace (/[?]/g,"-");
            document.getElementById("replyTime["+index+"]").innerHTML = tim;
        })
    })
}

function replyToggle(index){
    if(document.getElementById("message["+index+"]").style.display =="inline"){
        document.getElementById("message["+index+"]").style.display = "none";
        document.getElementById("reply["+index+"]").innerHTML = "Reply";
        document.getElementById("btn["+index+"]").style.display = "none";

    }
    else{
        document.getElementById("message["+index+"]").style.display = "inline";
        document.getElementById("reply["+index+"]").innerHTML = "Collapse";
        document.getElementById("btn["+index+"]").style.display = "inline";
    }
}

function sendMess(id,year,month,index,date,h,m,s,feedbackID){

    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();

    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var nowYear = today.getFullYear();

    var nowadays = nowYear +"-"+ mm+"-"+ dd;
    var time = hour+":"+minute+":"+second;
    var repliedTime = nowadays+"?"+time;
    var repliedTime1 = nowadays+"-"+time;
    var lateDate =year+"-"+month+"-"+date;


    firebase.database().ref("Feedback/"+id+"/System/"+lateDate+"/ID-"+feedbackID+"/Replied").remove();


    document.getElementById("replyTime["+index+"]").innerHTML = repliedTime1;



    var comment = document.getElementById("message["+index+"]").value;
    var comment1 = comment.replace(/[ ]/g, "~");

    firebase.database().ref("Feedback/"+id+"/System"+"/"+lateDate+"/ID-"+feedbackID+"/Replied/"+repliedTime).set(comment1);

    document.getElementById("replyComment["+index+"]").innerHTML = comment;
    replyToggle(index);

}

setTimeout(function(){
    pat = document.getElementById("container");
    staff = document.getElementById("container1");
    sorting(pat);
    sorting(staff)
}, 3000);
function sorting(table){
  var  rows, switching, i, x, y, s, shouldSwitch, dir, switchcount = 0;

  switching = true;
  dir = "asc";
  rows = table.getElementsByTagName("div");


  while (switching) {

    switching = false;
    for (i = 0; i < rows.length-4; i=i+4) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("span")[4];
        y = rows[i+4].getElementsByTagName("span")[4];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i+4], rows[i]);
      switching = true;
      switchcount ++;
    }
  }
}


function showsf(){
  document.getElementById("container").style.display = "block";
  document.getElementById("container1").style.display = "none";
  document.getElementById("stafffeedbackspan").style.opacity = "1";
  document.getElementById("patientfeedbackspan").style.opacity = ".8";
}



function showpf(){
  document.getElementById("container").style.display = "none";
  document.getElementById("container1").style.display = "block";
  document.getElementById("stafffeedbackspan").style.opacity = ".8";
  document.getElementById("patientfeedbackspan").style.opacity = "1";
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


var a = new Date();
var hour = a.getHours();
var minute = a.getMinutes();
var second = a.getSeconds();

var time = hour+":"+minute+":"+second;
