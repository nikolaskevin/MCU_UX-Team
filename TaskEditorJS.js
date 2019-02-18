// Task Tree View
var main = document.getElementById('treemenu2'),
  tree = new VanillaTree(main,{
    contextmenu: [{
      label :'Move up',
      action: function(id){
        var x = tree.getLeaf(id);
        var parentId = x.parentNode.parentNode.getAttribute('data-vtree-id');
        var cat = document.getElementById('CategoryFilter').value;
        var realid = id.replace(':'+parentId,"");
        var fbti = firebase.database().ref('TaskInstruction/'+cat+'/'+parentId);
        var nextS = tree.getLeaf(id).previousSibling.getAttribute('data-vtree-id');
        var stepref = nextS.replace(':'+parentId,"");
        let temp = [];
        if(stepref != 'Info'){
          fbti.child(realid).once('value').then(function(snapshot){
            var tempData = snapshot.val();
            temp[0] = tempData.MtitleIOS;
            temp[1] = tempData.MtitleAndroid;
            temp[2] = tempData.MDescriptionIOS;
            temp[3] = tempData.MDescriptionAndroid;
            temp[4] = tempData.Step;
            if(snapshot.child('picurl').exists()){
              temp[5] = tempData.picurl;
            }
           console.log(temp);
           swapStep(realid,temp,fbti,stepref,parentId,cat);

          });
        }else{
          alert("It's already the first step!");
        }
      }
    },
    {
      label :'Move down',
      action: function(id){
        var x = tree.getLeaf(id);
        var parentId = x.parentNode.parentNode.getAttribute('data-vtree-id');
        var cat = document.getElementById('CategoryFilter').value;
        var realid = id.replace(':'+parentId,"");
        var fbti = firebase.database().ref('TaskInstruction/'+cat+'/'+parentId);
        let temp = [];
        try{
          var nextS = tree.getLeaf(id).nextSibling.getAttribute('data-vtree-id');
          var stepref = nextS.replace(':'+parentId,"");
          fbti.child(realid).once('value').then(function(snapshot){
            var tempData = snapshot.val();
            temp[0] = tempData.MtitleIOS;
            temp[1] = tempData.MtitleAndroid;
            temp[2] = tempData.MDescriptionIOS;
            temp[3] = tempData.MDescriptionAndroid;
            temp[4] = tempData.Step;
            if(snapshot.child('picurl').exists()){
              temp[5] = tempData.picurl;
            }
           console.log(temp);
           swapStep(realid,temp,fbti,stepref,parentId,cat);
          });
        }catch(err){
          alert("It's already the last step!");
        }
      }

    },
    {
      label: 'Delete',
      action: function(id) {
        var x = tree.getLeaf(id);
        var parentId = x.parentNode.parentNode.getAttribute('data-vtree-id');
        var cat = document.getElementById('CategoryFilter').value;
        var fbti = firebase.database().ref('TaskInstruction/'+cat);
        var realid = id.replace(':'+ parentId,'');
        if(parentId == null){
          fbti.child(id).remove();
          tree.remove(id);
        }else{
          fbti.child(parentId).child(realid).remove();
          tree.remove(id);
        }
      }
      }]
  });

  function swapStep(realid,temp,fbti,stepref,parentId,cat){
    fbti.child(stepref).once('value')
    .then(function(snapshot){
      var Mtitle =  snapshot.child('MtitleIOS').val();
      var Mtitle2 = snapshot.child('MtitleAndroid').val();
      var MD = snapshot.child('MDescriptionIOS').val();
      var MD2 = snapshot.child('MDescriptionAndroid').val();
      var MstepNo = snapshot.child('Step').val();
      if(snapshot.child('picurl').exists()){
        var picurl = snapshot.child('picurl').val();
      }
      console.log(MstepNo);
      var notemp = temp[4];
      temp[4] = MstepNo;
      MstepNo =  notemp;
      console.log(MstepNo);
      console.log(temp[4]);
      var data = {
        MtitleIOS:Mtitle,
        MtitleAndroid:Mtitle2,
        MDescriptionIOS : MD,
        MDescriptionAndroid : MD2,
        Step: MstepNo
      };
      if(picurl != null){
        data["picurl"] = picurl;
      }

      var datatemp = {
        MtitleIOS: temp[0],
        MtitleAndroid: temp[1],
        MDescriptionIOS : temp[2],
        MDescriptionAndroid : temp[3],
        Step: temp[4]
      };
      if(temp[5] != null){
        datatemp["picurl"] = temp[5] ;
      }
      var updates ={};
      console.log(data);
      console.log(datatemp);

     updates['TaskInstruction/'+cat+'/'+ parentId + '/' + realid ]= data;
     updates['TaskInstruction/'+cat+'/'+ parentId + '/' + stepref ]= datatemp;

     firebase.database().ref().update(updates);
     //You have to select the task step first
     var id = realid + ":"+parentId;
     tree.select(id);
     tree.select(parentId);
    });
  }



//TODO:Alllocate the proper pathing in firebase db
var fbCat = firebase.database().ref('TaskInstruction');
fbCat.once("value").then(function(snapshot){
  var arr = [];
  var k = 0;
  snapshot.forEach(function(C_childSnapshot){
  var C_childKey = C_childSnapshot.key;
  arr.push(C_childKey); // add the childkey into array, push is add
  //console.log(arr[k]); // to show the key on the console
  var y = document.getElementById("CategoryFilter");
  var Coption = document.createElement("option");
  Coption.setAttribute("value",""+C_childKey+"");
  Coption.setAttribute("id",""+C_childKey+"");

  Coption.text= arr[k];
  y.appendChild(Coption);
  k=k+1;
});
});

var old_html = $('.vtree').html();
function filterCategory(cat){
  if(document.getElementById('treemenu2').innerText != ""){
  $('.vtree').html(old_html);
  }

  var categoryname = document.getElementById('CategoryFilter').value;
  fbTask = fbCat.child(categoryname);
  fbTask.once('value')
    .then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var id = childSnapshot.key;
        var options={
          label: id,
          id : id,
        }
        tree.add(options);
        var fbMain= fbTask.child(id);
        fbMain.once('value')
          .then(function(Tasksnapshot){
            Tasksnapshot.forEach(function(MainstepchildSnapshot){
              var childid = MainstepchildSnapshot.key;
              var task = {
                label: childid,
                id:childid + ':' +id,
                parent:id,

              }
              tree.add(task);

            });
          });
      });
    });

}


  main.addEventListener('vtree-add', function(evt) {
    console.log("add");
  });

  main.addEventListener('vtree-remove', function(evt) {
    console.log("delete");
  });

  main.addEventListener('vtree-open', function(evt) {
    console.log('open');

  });

  main.addEventListener('vtree-close', function(evt) {

  });



// Content of Task  - Category selection
var fbCat= firebase.database().ref('TaskInstruction')
fbCat.once("value")
  .then(function(snapshot){
    var arr = [];
    var i = 0;
    snapshot.forEach(function(childSnapshot){
      var childKey = childSnapshot.key;
      arr.push(childKey); // add the childkey into array, push is add
      //console.log(arr[i]); // to show the key on the console
      var y = document.getElementById("CatOption");
      var option = document.createElement("option");
      option.value = arr[i];
      y.appendChild(option);

      //console.log(i);
      i=i+1;
      });
});

//Input the Content of Task
function TaskSubmit(){
  var Ttitle  = document.getElementById('Ttitle').value;
  //console.log('Ttitle ='+Ttitle);
  var Ttitle2 = "xtsx"+Ttitle+"xtex";
  var videoURL = document.getElementById('videoURL').value;
  var Outline = document.getElementById('Outline').value;
  var Outline2 = 'xosx'+ Outline +'xoex';
  var Note = document.getElementById('Note').value;
  var Note2 = 'xnsx'+ Note +'xnex';
  var selectCat = document.getElementById('selectCat').value;
//  console.log(selectCat);
  var Tdata = {
    TtitleIOS : Ttitle,
    TtitleAndroid : Ttitle2,
    videoURL : videoURL,
    OutlineIOS : Outline,
    OutlineAndroid : Outline2,
    NoteIOS : Note,
    NoteAndroid : Note2,
    Category : selectCat
  }

  if(Ttitle == "" || Outline == ""){
    alert("Please enter title and outline")
}else {
  var updates = {};
  updates['TaskInstruction/'+ selectCat + '/' + Ttitle + '/Info' ] = Tdata;
  firebase.database().ref().update(updates);
  alert('Successfully Created a New Task');
}
}


var j = 1;
let file;
function handleuploadfile(e) {
    console.log(e);
    file=$('#uploader'+e).get(0).files[0];
    console.log(file);
}

function handleuploadfileSubmit(pid,cat,Mtitle,Mtitle2,videoURL,MstepNo,MD,MD2,uploader,updates,j){
  console.log(file);
  var storageRef=firebase.storage().ref('Task/'+file.name);
  var uploadtask = storageRef.put(file);
  uploadtask.on('state_changed',
  //  function error(err){
  //    console.log("failed");
  //  },
    function complete(){
      storageRef.getDownloadURL()
        .then(function(url){
        var mdata={
          MtitleIOS:Mtitle,
          MtitleAndroid:Mtitle2,
          MDescriptionIOS : MD,
          MDescriptionAndroid : MD2,
          Step: MstepNo,
          picurl: url,
          picFilename: file.name
        };
        var fbsearch = firebase.database().ref('TaskInstruction/'+cat).child(pid);
        fbsearch.once('value', function(snapshot){
                if(snapshot.hasChild('Step'+MstepNo)){
                    var r = confirm('There is an existing data in Step:'+MstepNo+'!');
                    if (r == true){
                        updates['TaskInstruction/'+ cat + '/' + pid + '/' +'Step'+ MstepNo] = mdata;
                        firebase.database().ref().update(updates);
                        alert('Successfully Created a step');
                    }
                    else{
                        alert('Please confirm the existing step data!');
                    }
                }
                else{
                    console.log('qqqq');
                    updates['TaskInstruction/'+ cat + '/' + pid + '/' +'Step'+ MstepNo] = mdata;
                    firebase.database().ref().update(updates);
                    alert('Successfully Created a step');
                }

        });
      });
    }
  );
}

function MainstepSubmit(j){
  //console.log(j);
  var pid = document.getElementById('Ttitle').value;
  //console.log('pid='+pid);
  var cat = document.getElementById('selectCat').value;
  var Mtitle = document.getElementById('Mtitle'+j).value;
  var Mtitle2 = 'xtsx'+ Mtitle +'xtex';
  var MstepNo = document.getElementById('MstepNo'+j).value;
  var MD = document.getElementById('MDescription'+j).value;
  var MD2 = 'xdsx'+MD+'xdex';
  if ( Mtitle == "" || MD == ""){
    alert ("Please enter mainstep title and description")
  }
  else {
  var updates={};
  var uploader=document.getElementById('uploader'+j).value;
  //console.log(uploader);
  if(uploader != ""){
    handleuploadfileSubmit(pid,cat,Mtitle,Mtitle2,videoURL,MstepNo,MD,MD2,uploader,updates,j);

  }else{
    var mdata={
      MtitleIOS:Mtitle,
      MtitleAndroid:Mtitle2,
      MDescriptionIOS : MD,
      MDescriptionAndroid : MD2,
      Step: MstepNo
    };
    var fbsearch = firebase.database().ref('TaskInstruction/'+cat).child(pid);
    fbsearch.once('value', function(snapshot){
        console.log(MstepNo+'12312312312');
        console.log(snapshot.hasChild('Step'+MstepNo));
            if(snapshot.hasChild('Step'+MstepNo)){
                var r = confirm('There is an existing data in Step:'+MstepNo+'!');
                if (r == true){
                    updates['TaskInstruction/'+ cat + '/' + pid + '/' +'Step'+ MstepNo] = mdata;
                    firebase.database().ref().update(updates);
                    alert('Successfully Created a step');
                }
                else{
                    alert('Please confirm the existing step data!');
                }
            }
            else{
                console.log('qqqq');
                updates['TaskInstruction/'+ cat + '/' + pid + '/' +'Step'+ MstepNo] = mdata;
                firebase.database().ref().update(updates);
                alert('Successfully Created a step');
            }

    });
  }
}


//$('.vtree').load(window.locaiton.href+ ".vtree");
}

// if selected -> display
var task_html = $('#showbox').html();
main.addEventListener('vtree-select', function(evt) {
  treeSelection(evt.detail.id);
});

function displayMainsteps(j,path,cat){
  //console.log('==='+j);
  var fbTI = firebase.database().ref('TaskInstruction/'+cat+'/'+path);
  var mainstep='Step' + j;
  fbTI.child(mainstep).once('value',function(snapshot){
    if(snapshot.exists()){
      MainstepPageGenerator(j);
      document.getElementById('Mtitle'+j).value = snapshot.child('MtitleIOS').val();
      document.getElementById('MstepNo'+j).value = snapshot.child('Step').val()
      document.getElementById('MDescription'+j).value = snapshot.child('MDescriptionIOS').val();
      if(snapshot.child('picurl').exists()){
        document.getElementById('picture'+j).src = snapshot.child('picurl').val() ;
      }
      j++;
      console.log(j+'asdasd');
      displayMainsteps(j,path,cat);
    }else{
      console.log('thats all');
    }
  });
}

function displayTask(id,parentId,parentId2){
    document.getElementById('deslist').style.display = 'block';
    var cat =  document.getElementById('CategoryFilter').value;
    var fbTI = firebase.database().ref('TaskInstruction/'+cat+'/'+id); //evt.detail.id is the selected id
    fbTI.child('Info').on('value', function(snapshot){
      document.getElementById('Ttitle').value = snapshot.child('TtitleIOS').val();
      document.getElementById('videoURL').value = snapshot.child('videoURL').val();
      document.getElementById('Outline').value = snapshot.child('OutlineIOS').val();
      document.getElementById('Note').value = snapshot.child('NoteIOS').val();
      document.getElementById('selectCat').value = snapshot.child('Category').val();
      var j = 1;
      displayMainsteps(j,id,cat);
    });
}

function treeSelection(id,parentId,parentId2){
  var x = tree.getLeaf(id);
  var parentId = x.parentNode.parentNode.getAttribute('data-vtree-id');
  console.log('xxxx'+parentId);
  var parentId2 = document.getElementById('Ttitle').value;
  console.log('zzzz'+parentId2);
  if(parentId == null){
    $('#showbox').html(task_html);
    displayTask(id, parentId);
  }else{
    console.log(id);
    if(id == 'Info:'+parentId){
      document.getElementById('TaskInfo').scrollIntoView();
    }else if(parentId == parentId2){
      var i = id.charAt(4);
      console.log(i);
    document.getElementById('Mtable'+i).scrollIntoView();
    }else{
      $('#showbox').html(task_html);
      displayTask(tree.getLeaf(id).parentNode.parentNode.getAttribute('data-vtree-id'), parentId, parentId2);
      treeSelection(tree.getLeaf(id).parentNode.parentNode.getAttribute('data-vtree-id'));
  }
  }
}

//table for Mainstep is below
function MainstepPageGenerator(j){
var body = document.getElementById("showbox");
var tbl = document.createElement("table");
tbl.setAttribute("id","Mtable"+j);
var range = 660;
var i = j;
console.log(j);
if( j == 1){
  tbl.setAttribute("style","position:absolute;width:500px;top:-4.2px;left:"+range+"px;height:438px;background-color:rgba(255, 255, 255, .8);border-left: 1px solid black;border-right:1px solid black;border-bottom:hidden;");
}
else{
  j=j-1;
  var extend = 569*j;
  var r = range + extend;
  console.log(r);
  console.log(range);
  tbl.setAttribute("style","position:absolute;width:500px;top:-4.2px;left:"+r+"px;height:438px;background-color:rgba(255, 255, 255, .8);border-left: 1px solid black;border-right:1px solid black;border-bottom:hidden;");
  j++;
}

var tblBody = document.createElement("tbody");

  // Row 1
  var row1 = document.createElement("tr");
  var Mheader1 = document.createElement("th");
  var title = document.createElement("textarea");
  title.setAttribute("id","Mtitle"+j);
  Mheader1.setAttribute("colspan","2");
  Mheader1.appendChild(document.createTextNode("Mainstep Name:"));
  Mheader1.appendChild(title);
  row1.appendChild(Mheader1);
  tblBody.appendChild(row1);

  //Row 2
  var row2 = document.createElement("tr");
  var num = document.createElement("td");
  var inputnum = document.createElement("input");
  var inputurl = document.createElement("input");
  inputnum.setAttribute("id","MstepNo"+j);
  inputnum.setAttribute("type","number");
  num.setAttribute("colspan","2");
  num.appendChild(document.createTextNode('Mainstep Number:'));
  num.appendChild(inputnum);
  row2.appendChild(num);
  tblBody.appendChild(row2);

  //Row 3
  var row3 = document.createElement("tr");
  var md = document.createElement("td");
  var mdtext = document.createElement("textarea");
  mdtext.setAttribute("id","MDescription"+j);
  mdtext.setAttribute("rows","7");
  mdtext.setAttribute("cols","75");
  md.setAttribute("colspan","2");
  md.appendChild(document.createTextNode("Main Description:"));
  md.appendChild(mdtext);
  row3.appendChild(md);
  tblBody.appendChild(row3);

  //row 4
  var row4 = document.createElement("tr");
  var uploadCol = document.createElement("td");
  var picdisplay = document.createElement("td");
  var uploadBut = document.createElement("input");
  var showpic = document.createElement("img");
  uploadBut.setAttribute("id","uploader"+j);
  uploadBut.setAttribute("type","file");
  uploadBut.setAttribute("accept","image/*");
  uploadBut.setAttribute("onchange", "handleuploadfile("+j+")");
  showpic.setAttribute("id","picture"+j);
  showpic.setAttribute("height","150");
  showpic.setAttribute("width","200");
  uploadCol.appendChild(document.createTextNode("Upload picture here:"));
  uploadCol.appendChild(uploadBut);
  picdisplay.appendChild(showpic);
  row4.appendChild(uploadCol);
  row4.appendChild(picdisplay);
  tblBody.appendChild(row4);

  //row5
  var row5 = document.createElement("tr");
  var lastrowBut = document.createElement("td");
  var saveBut = document.createElement("button");
  var deleteBut = document.createElement("button");
  lastrowBut.setAttribute("colspan","2");
  saveBut.appendChild(document.createTextNode("Save"));
  saveBut.setAttribute("onclick","MainstepSubmit("+j+")");
  deleteBut.appendChild(document.createTextNode("Delete"));
  deleteBut.setAttribute("onclick","deleteM("+j+")");
  lastrowBut.appendChild(saveBut);
  lastrowBut.appendChild(deleteBut);
  row5.appendChild(lastrowBut);
  tblBody.appendChild(row5);


tbl.appendChild(tblBody);
body.appendChild(tbl);
tbl.setAttribute("border", "2");
document.getElementById("MstepCount").innerHTML = i;
i+=1;
}
//count mainsteps
var clicks = 0;
function onClick(){
  document.getElementById('deslist').style.display = 'block';
  console.log(document.getElementById('MstepCount').innerText);
  if(document.getElementById('MstepCount').innerText == ''){
    clicks = 1;
    console.log('123'+clicks);
    j = clicks;
    document.getElementById("MstepCount").innerHTML = clicks;
  }else{
    var clicks = parseInt(document.getElementById('MstepCount').innerText);
    clicks += 1;
    j = clicks;
  }
  return MainstepPageGenerator(j);
}

//delete Mainstep
function deleteM(j){
  var task = document.getElementById("Ttitle").value;
  var cat = document.getElementById('selectCat').value;
  var Step = document.getElementById('MstepNo'+j).value;
  var fbM = firebase.database().ref('TaskInstruction/'+cat+'/'+task);
  var treeviewhtml = $('.vtree').html();
  fbM.child('Step'+Step+'/picFilename').once('value', function(snapshot){
      if(snapshot.exists()){
          var filename = snapshot.val();
          var storageRef = firebase.storage().ref();
          storageRef.child('Task/'+filename).delete()
            .then(function(){
                var r = confirm("are you sure of deleting this Mainstep?");
                if (r==true){
                fbM.child('Step'+ Step).remove();
                alert("successfully deleting the MainStep!");
                $('.vtree').html(treeviewhtml);
                $('#Mtable'+j).remove();
                }
            })
      }
  });

}

//delete Task
function deleteT(){
  var task = document.getElementById('Ttitle').value;
  var cat = document.getElementById('selectCat').value;
  console.log(cat +'/'+ task);
  var fbT = firebase.database().ref('TaskInstruction/'+cat);
  var r = confirm("are you sure of deleting the Task?");
  if (r==true){
    fbT.child(task).remove();
    alert("successfully deleted the Task!");
    window.location.reload();
  }else{

  }
}

function task_nextarrow(){
  console.log("ff");
  document.getElementById("nextmainstep").style.display = "block";
  document.getElementById("thissecondmainstep").style.display = "none";
}

///////////////////////////////////////////////////////////////////////////////////////////

    var from = sessionStorage.getItem("from");
    var cat = sessionStorage.getItem("category");
    var taskN = sessionStorage.getItem("taskname");

    if(from == 'Library.html') {
        sessionStorage.setItem("from","");
        console.log(cat);
        console.log(taskN);
        setTimeout(function(){
            $('#CategoryFilter').val(cat);
            filterCategory(cat);
        }, 2000);
        setTimeout(function(){
            tree.select(taskN);
        },3500);
        //filterCategory(cat);

        //tree.select(parentId);
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
