var firebase;
$(function(){
  var $name = $('#name'),
      $content = $('#content'),
      $btn = $('#btn'),
      $show = $('#show'),
      ms = new Date().getTime();

  var database = firebase.database().ref("chat");

  $btn.on('click',write);
  $content.on('keydown', function(e){
    if(e.keyCode == 13){
      write();
    }
  });

  function write(){
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
      name:$('#name').val(),
      content:$('#content').val(),
      time:now,
      id:'id'+ms
    };
    database.push(postData);
    $content.val('');
  }

  database.once('value', function(snapshot) {
    $show.html('');
    for(var i in snapshot.val()){
       $show.append('<div><div class="time">'+snapshot.val()[i].time+'</div><div class="name">'+snapshot.val()[i].name+' :</div><div class="content">'+snapshot.val()[i].content+'</div>');
    }
    $show.scrollTop($show[0].scrollHeight);
  });

  database.limitToLast(1).on('value', function(snapshot) {
    for(var i in snapshot.val()){
       $show.append('<div class="'+snapshot.val()[i].id+'"><div class="time">'+snapshot.val()[i].time+'</div><div class="name">'+snapshot.val()[i].name+' :</div><div class="contentI">'+snapshot.val()[i].content+'</div>');
    }
    $show.scrollTop($show[0].scrollHeight);
    $show.find('.id'+ms+' .name').css({
      'float':'right',
      'padding-top':'12px',
      'color':'#FFCC33'

    });
    $show.find('.id'+ms+' .contentI').css({
      'float':'right',
      'margin-right':'10px'
    });
    $show.find('.id'+ms+' .time').css({
      'right':'0',
      'color':'#777'
    });
  });
});

function cancel(){
    document.getElementById("im").style.display = "none";
}
function expand(){
    document.getElementById("im").style.display = "block";
}
