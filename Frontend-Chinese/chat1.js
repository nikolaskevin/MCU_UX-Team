function displayChat(i){
    var chatall = document.getElementById("chatAll");
    var chatpart = document.getElementById("chatPart");
    console.log(i);


    if (i==0){
        chatall.classList.add('active');
        if (chatpart.classList.contains('active')) {
          chatpart.classList.remove('active');
        }
        if(document.getElementById('im'+i)== null){
            if (document.getElementById('im1')!= null){
                document.getElementById('im1').style.display = 'none';
            }
            chatForm(i);
        }
        else{
            document.getElementById('im'+i).style.display  = 'block';
            if(document.getElementById('im1')!= null){
                document.getElementById('im1').style.display  = 'none';
            }
        }
    }else if(i == 1){
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
function chatForm(i){


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
    document.getElementById("name"+i).value = userName;

    if(i ==0){
        database = 'Chat/All';
    }else{
        database = "Chat/Part";
    }
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
        console.log("show");
        snapshot.forEach(function(childSnapshot1){
            childSnapshot1.forEach(function(childSnapshot2){
                if(childSnapshot2.key =="name"){
                    name = childSnapshot2.val();
                }
                if(childSnapshot2.val() =="haven't read"){
                    if(name==userName){
                        console.log(name,userName);
                        for(var i in snapshot.val()){
                            $show.append('<div class="'+snapshot.val()[i].id+'"><div class="nameI">'+snapshot.val()[i].name+':</div><div class="contentI">'+snapshot.val()[i].content+' </div><div class="timeI">'+snapshot.val()[i].time+'</div>');
                        }
                    }
                    else{
                        for(var i in snapshot.val()){
                            $show.append('<div class="'+snapshot.val()[i].id+'"><div class="name">'+snapshot.val()[i].name+':</div><div class="content">'+snapshot.val()[i].content+' </div><div class="time">'+snapshot.val()[i].time+'</div>');
                        }
                    }
                }
            })
        })


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
    document.getElementById("notification").style.display = "none";
    count =0;

}

function expand(){
    var fbChat = firebase.database().ref("Chat/All");
    fbChat.limitToLast(10).once('value').then(function(snapshot) {
        var lastid = snapshot.node_.children_.root_.key;
        firebase.database().ref("Chat/All/"+lastid+"/status").set("read");
    })
    document.getElementById("leftList").style.display = "block";
    document.getElementById("expand").style.display = "none";
    displayChat(0);
}

function write(ms,database,$content,userName){
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
    id:'id'+ms,
    status:"haven't read"
    };
    database.push(postData);
    $content.val('');
}

var fbChat = firebase.database().ref("Chat/All");
var count=0;

fbChat.limitToLast(1).on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot1){
        childSnapshot1.forEach(function(childSnapshot2){
            if(childSnapshot2.val() =="haven't read"){
                count++;
                console.log(count);
                document.getElementById("notification").style.display = "block";
                document.getElementById("notification").innerHTML = count;
            }
        })
    })
})
countUnread()
function countUnread(){
    fbChat.limitToLast(10).once("value")
       .then(function(snapshot){
           snapshot.forEach(function(childSnapshot1){
               childSnapshot1.forEach(function(childSnapshot2){
                   if(childSnapshot2.val() =="haven't read"){
                       count++;
                       console.log(count);
                       document.getElementById("notification").style.display = "block";
                       document.getElementById("notification").innerHTML = count;
                   }
                })
            })
       })
   }
