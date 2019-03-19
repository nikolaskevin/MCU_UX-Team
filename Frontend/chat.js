// this code is really messy, I'll try my best to expain each function. Even though this code is coding by myself, I still can't totally understand every line;#2018/12/09
var xxx ="false";
function displayChat(i){// Click the different chat room and show that content.
    var chatall = document.getElementById("chatAll");
    var chatpart = document.getElementById("chatPart");
    if (i==0){
        if(xxx =="true"){ // I know it's suck, but I have no choice and no time to find the better one. To avoid the notification dispaly "none" at the first time, it's has to click the second chat's room and then click the first chat's room back.
            document.getElementById("notificationAll").style.display = "none";
        }
        count =0; // because click this room, make the number of unread become "0"
        chatall.classList.add('active');// Relate to Css, Click the room and show different color;
        if (chatpart.classList.contains('active')) {
          chatpart.classList.remove('active');
        }
        if(document.getElementById('im'+i)== null){ // If chat form havn't create.
            if (document.getElementById('im1')!= null){
                document.getElementById('im1').style.display = 'none';
            }
            chatForm(i); // To create the chat form.
        }
        else{
            document.getElementById('im'+i).style.display  = 'block';
            if(document.getElementById('im1')!= null){
                document.getElementById('im1').style.display  = 'none';
            }
        }
    }else if(i == 1){
        xxx = "true";
        countPart = 0;// because click this room, make the number of unread become "0"
        document.getElementById("notificationPart").style.display = "none";// Close this chat's notification
        var userName2 = firebase.auth().currentUser.displayName; // get the user name by firebase auth
        var fbPartread = firebase.database().ref("Chat/Partread");
        fbPartread.once('value').then(function(snapshot) {//make all status into "read";
            snapshot.forEach(function(childSnapshot1){
                var eachKey = childSnapshot1.key;
                firebase.database().ref("Chat/Partread/"+eachKey+"/"+userName2).set("read");
            })
        })
        chatpart.classList.add('active');
        if (chatall.classList.contains('active')) {
          chatall.classList.remove('active');
        }
        if(document.getElementById('im'+i)== null){
            if (document.getElementById('im0') != null){
                document.getElementById('im0').style.display  = 'none';
            }
            chatForm(i);
        }
        else{
            document.getElementById('im'+i).style.display  = 'block';
            document.getElementById('im0').style.display  = 'none';
        }
    }
}
function chatForm(i){ // To create the chat form.
    var body = document.getElementsByTagName('body')[0];
    var div1 =document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var span = document.createElement('span');
    var input = document.createElement('input');
    var button = document.createElement('button');
    var x = document.createElement('button');

    div1.setAttribute('id','im'+i);
    div2.setAttribute('id','cover');
    //div2.appendChild(document.createTextNode('X'));
    div2.setAttribute('onclick','cancel('+i+')');
    input.setAttribute('id', 'content'+i);
    button.setAttribute('id','btn'+i);
    span.setAttribute('id', 'name'+i);
    span.setAttribute('style', 'display:inline;');
    div3.setAttribute('id','input'+i);
    div5.setAttribute('id','show'+i);
    x.setAttribute("id","cancelX"+i);


    body.appendChild(div1);
    div1.appendChild(div2);
    div2.appendChild(x);
    div1.appendChild(div3);
    div3.appendChild(div4)
    div4.appendChild(span);
    div4.appendChild(input);
    div3.appendChild(button);
    div1.appendChild(div5);
    document.getElementById("cancelX"+i).innerHTML = "X";

    var $show = $('#show'+i);
    var ms = new Date().getTime();
    var $btn = $('#btn'+i);
    var $content = $('#content'+i);
    var database;
    var userName = firebase.auth().currentUser.displayName;
    button.innerHTML= "Send";
    document.getElementById("name"+i).innerHTML = userName;
    //document.getElementById("name"+i).value = userName;

    if(i ==0){
        database = 'Chat/All';
    }else{
        database = "Chat/Part";
    }
    $btn.click(function(){
        write(ms,database,$content,userName);
    })
    $content.on('keydown', function(e){
      if(e.keyCode == 13){ // "Enter" key;
        write(ms,database,$content,userName);
      }
    });

    callChatData(database,$show,userName,$content,$btn,ms);
}

function callChatData(database,$show,userName,$btn,$content,ms){ // To put the messages into chat room
    var database = firebase.database().ref(database);
    database.once('value', function(snapshot) {
      $show.html('');// To clear the messages at first.
      for(var i in snapshot.val()){
          if(snapshot.val()[i].name == userName){ //To separate the messages into left and right side by name
              $show.append('<div class="'+snapshot.val()[i].id+'"><div class="nameI">'+snapshot.val()[i].name+':</div><div class="contentI">'+snapshot.val()[i].content+' </div><div class="timeI">'+snapshot.val()[i].time+'</div>');
          }
          else{
              $show.append('<div><div class="name">'+snapshot.val()[i].name+':</div><div class="content">'+snapshot.val()[i].content+' </div><div class="time">'+snapshot.val()[i].time+'</div>');
          }
      }

      $show.find(' .nameI').css({
         'text-align':'right',
        'display':'block',
        'padding-left':'60%',
        'padding-top':'40px',
        'padding-bottom':'0px',
        'color':'#FFCC33',
        'float':'right',
        'width':'100%',
      });
      $show.find(' .contentI').css({
        'display':'block',
        'margin-right':'10px',
        'margin-top':'0px',
        'float':'right',
       'padding-top':'6px',
       'word-wrap':'break-word',

      });
      $show.find(' .timeI').css({
        'display':'inline',
        'color':'#CCCCCC',
        'margin-left':'90%',
        'width':'100%',
        'font-size':'6px',
      });
      $show.find(' .name').css({
          'text-align':'left',
         'display':'block',
         'padding-right':'80%',
         'padding-top':'10px',
         'padding-bottom':'0px',
         'width':'100%',
        'display':'block',
        'float':'left',

      });
      $show.find(' .content').css({
          'display':'block',
          'margin-left':'10px',
          'margin-top':'0px',
          'float':'left',
         'padding-top':'6px',
       'word-wrap':'break-word',
      });
      $show.find(' .time').css({
          'float':'left',
          'position':'relative',
          'left':'20px',
          'display':'inline',
          'color':'#CCCCCC',
          'margin-right':'90%',
          'width':'100%',
          'font-size':'6px',
      });
      $show.scrollTop($show[0].scrollHeight);


    });
    database.limitToLast(1).on('value', function(snapshot) {//Realtime; Get the latest message and separate by name;
        if(snapshot.node_.children_.root_.value.children_.root_.value.value_==userName){// Using the "console.log(snapshot)" to find the name the user who send the message
            for(var i in snapshot.val()){
                $show.append('<div class="'+snapshot.val()[i].id+'"><div class="nameI">'+snapshot.val()[i].name+':</div><div class="contentI">'+snapshot.val()[i].content+' </div><div class="timeI">'+snapshot.val()[i].time+'</div>');
            }
        }
        else{
            for(var i in snapshot.val()){
                $show.append('<div class="'+snapshot.val()[i].id+'"><div class="name">'+snapshot.val()[i].name+':</div><div class="content">'+snapshot.val()[i].content+' </div><div class="time">'+snapshot.val()[i].time+'</div>');
            }
        }


      $show.find('.id'+ms+' .nameI').css({
          'text-align':'right',
         'display':'block',
         'padding-left':'60%',
         'padding-top':'40px',
         'padding-bottom':'0px',
         'color':'#FFCC33',
         'float':'right',
         'width':'100%',
      });
      $show.find('.id'+ms+' .contentI').css({
          'display':'block',
          'margin-right':'10px',
          'margin-top':'0px',
          'float':'right',
         'padding-top':'6px'
      });
      $show.find('.id'+ms+' .timeI').css({
          'display':'inline',
          'color':'#CCCCCC',
          'margin-left':'90%',
          'width':'100%',
          'font-size':'6px',
      });
      $show.find(' .name').css({
          'text-align':'left',
         'display':'block',
         'padding-right':'80%',
         'padding-top':'10px',
         'padding-bottom':'0px',
         'width':'100%',
        'display':'block',
        'float':'left',

      });
      $show.find(' .content').css({
          'display':'block',
          'margin-left':'10px',
          'margin-top':'0px',
          'float':'left',
         'padding-top':'6px',
       'word-wrap':'break-word',
      });
      $show.find(' .time').css({
          'float':'left',
          'position':'relative',
          'left':'20px',
          'display':'inline',
          'color':'#CCCCCC',
          'margin-right':'90%',
          'width':'100%',
          'font-size':'6px',
      });
      $show.scrollTop($show[0].scrollHeight);
    });
}


function cancel(){
    if(document.getElementById("im0").style.display == "none"){
        document.getElementById("im1").style.display = "none";
    }
    else{
        document.getElementById("im0").style.display = "none";

    }
    document.getElementById("leftList").style.display = "none";
    document.getElementById("expand").style.display = "block";
    document.getElementById("notificationAll").style.display = "none";
    total = count +countPart -1; // It's has to count again after close the form. because you might be click the room and read the message, the total unread will different. "-1" because call "totalNotRead"will add one, but no need.
    totalNotRead();
    count = 0; //To make the number of unread become "0"
}

function expand(){ //Click to open the chat
    xxx = "false";// to make the notification not disappear at the first in every time.
    var userName1 = firebase.auth().currentUser.displayName;
    var fbChat = firebase.database().ref("Chat/Allread");
    fbChat.once('value').then(function(snapshot) { // when open the chat and u will see this room, so change the status into "read"
        snapshot.forEach(function(childSnapshot1){
            var eachKey = childSnapshot1.key;
            firebase.database().ref("Chat/Allread/"+eachKey+"/"+userName1).set("read");
        })
    })
    document.getElementById("leftList").style.display = "block";
    document.getElementById("expand").style.display = "none";
    displayChat(0);// defaut; showing the "Center & System" chat;
}

function write(ms,database,$content,userName){
    var databaseText = database;
    var database = firebase.database().ref(database);
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if(h<10){
    h = '0'+h;
    }
    if(m<10){
    m = '0' + m;
    }
    if(s<10){
    s = '0' + s;
    }
    var now = h+':'+m+':'+s;
    var postData = {
    name:userName,
    content:$content.val(),
    time:now,
    id:'id'+ms
    };
    database.push(postData);
    database.limitToLast(1).once('value').then(function(snapshot){// the message is created by yourslef, so make this message into read;
        snapshot.forEach(function(childSnapshot){
            var randomKey = childSnapshot.key;
            firebase.database().ref(databaseText+"read/"+randomKey+"/"+userName).set("read");
        })
    })
    $content.val('');// after sending the message, clear the content;
}
var count = 0;
var countPart = 0;
setTimeout(function(){
    var user_name = document.getElementById("displayProfilename").innerHTML;
    var allread = firebase.database().ref("Chat/Allread");
    var partread = firebase.database().ref("Chat/Partread");

    function countAllRead(){// this function is count how many unread.
        totalNotRead();
        count = count +1;
        document.getElementById("notificationAll").style.display = "block";
        document.getElementById("notificationAll").innerHTML = count;
    }
    allread.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){ //check whether read or not
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                countAllRead();
            }
        })
    })
    count = 0;
    allread.limitToLast(1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                 countAllRead();
            }
        })
    })
    function countPartRead(){
        totalNotRead();
        countPart = countPart +1;
        document.getElementById("notificationPart").style.display = "block";
        document.getElementById("notificationPart").innerHTML = countPart;
    }
    partread.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                countPartRead();
            }
        })
    })
    countPart = 0; // the below code always be executed while the page reload, so deduct one to correct the counting number;
    partread.limitToLast(1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                 countPartRead();
            }
        })
    })
}, 2500);

var total = 0;
function totalNotRead(){
    total = total+1;
    document.getElementById("notification").style.display = "block";
    if(total =="0"){
        document.getElementById("notification").style.display = "none";
    }
    else{
        document.getElementById("notification").innerHTML = total;
    }
}
