function chatForm(){
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

    div1.setAttribute('id','im0');
    div2.setAttribute('id','cover');
    div2.setAttribute('onclick','cancel()');
    input.setAttribute('id', 'content0');
    button.setAttribute('id','btn0');
    span.setAttribute('id', 'name0');
    span.setAttribute('style', 'display:inline;');
    div3.setAttribute('id','input0');
    div5.setAttribute('id','show0');
    x.setAttribute("id","cancelX");


    body.appendChild(div1);
    div1.appendChild(div2);
    div2.appendChild(x);
    div1.appendChild(div3);
    div3.appendChild(div4)
    div4.appendChild(span);
    div4.appendChild(input);
    div3.appendChild(button);
    div1.appendChild(div5);
    document.getElementById("cancelX").innerHTML = "X";

    var $show = $('#show0');
    var ms = new Date().getTime();
    var $btn = $('#btn0');
    var $content = $('#content0');
    var database;
    var userName = firebase.auth().currentUser.displayName;
    button.innerHTML= "Send";
    document.getElementById("name0").innerHTML = userName;
    document.getElementById("name0").value = userName;

    database = 'Chat/All';

    $btn.click(function(){
        write(ms,database,$content,userName);
    })
    $content.on('keydown', function(e){
      if(e.keyCode == 13){
        write(ms,database,$content,userName);
      }
    });

    callChatData(database,$show,userName,$content,$btn,ms);
}

function callChatData(database,$show,userName,$btn,$content,ms){
    var database = firebase.database().ref(database);
    database.once('value', function(snapshot) {
      $show.html('');
      for(var i in snapshot.val()){
          if(snapshot.val()[i].name == userName){
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

    database.limitToLast(1).on('value', function(snapshot) {
        if(snapshot.node_.children_.root_.value.children_.root_.value.value_==userName){
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
    document.getElementById("im0").style.display = "none";
    document.getElementById("leftList").style.display = "none";
    document.getElementById("expand").style.display = "block";
    document.getElementById("notification").style.display = "none";
    count = 0;
}

function expand(){
    var userName1 = firebase.auth().currentUser.displayName;
    var fbChat = firebase.database().ref("Chat/Allread");
    fbChat.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot1){
            var eachKey = childSnapshot1.key;
            firebase.database().ref("Chat/Allread/"+eachKey+"/"+userName1).set("read");
        })
    })
    var chatall = document.getElementById("chatAll");
    chatall.classList.add('active');
    document.getElementById("leftList").style.display = "block";
    document.getElementById("expand").style.display = "none";
    if( document.getElementById("im0") == null){
        chatForm();
    }
    else{
        document.getElementById("im0").style.display = "block";
    }
}
function write(ms,database,$content,userName){
    var database = firebase.database().ref(database);
    var database1 = firebase.database().ref("Chat/Allread");
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
    id:'id'+ms,
    };
    database.push(postData);
    database.limitToLast(1).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var randomKey = childSnapshot.key;
            firebase.database().ref("Chat/Allread/"+randomKey+"/"+userName).set("read");
        })
    })
    $content.val('');
}
var count = 0;
setTimeout(function(){
    var user_name = document.getElementById("displayProfilename").innerHTML;
    var allread = firebase.database().ref("Chat/Allread");
    function checkRead(){
        count = count +1;
        document.getElementById("notification").style.display = "block";
        if(count =="0"){
            document.getElementById("notification").innerHTML = 1;
        }
        else{
            document.getElementById("notification").innerHTML = count;
        }
    }
    allread.once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                checkRead();
            }
        })
    })
    count = -1; // the below code always be executed while the page reload( I really don't understand the reason.....), so deduct one to correct the counting number.
    allread.limitToLast(1).on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot1){
            if(childSnapshot1.hasChild(user_name)){
                console.log(childSnapshot1.hasChild(user_name));
            }
            else{
                 checkRead();
            }
        })
    })
 }, 3000);
