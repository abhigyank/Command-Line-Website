var clear = $('.terminal-output').html();
var array = [];
var counter = -1;
var login = 0;
var email = 0;
var password = 0;
var em = "";
var username = 'guest';
var logged = 0;
var directory = "";
var nameofdir ="";
$(document).ready(function() {
  $('#root').html('root@' + username + ': ~$ ');
  $('textarea').focus();
});
$('textarea').blur(function(e){
  setTimeout(function(){
    $('textarea').focus();    
  }, 50);
});
var temp_command = '';
function reset(){
  $('textarea').val('');
  $('#live').html('');
  $('#live2').html('');
  $('.cursor').html('&nbsp');
};

document.addEventListener('keydown', function(event) {
  if (event.keyCode == 9) {
     event.preventDefault();
     
  }
});

$('textarea').keyup(function(e) {
  var command = $('textarea').val();
  var i;
  command = command.replace(/(\r\n|\n|\r)/gm,"");
  var ctrl = e.ctrlKey||e.metaKey; 

  if(command.search('<')!=-1 || command.search('>')!=-1){
    alert('> or < not allowed.');
    $('textarea').val($('textarea').val().substring(0,$('textarea').prop("selectionStart")-1));
    return;
  }

  if(command.length!=0 && ($('textarea').prop("selectionStart") == command.length)){
    for(i=array.length-1; i>=0; --i){
	    if(array[i].startsWith(command)){
	        break;
      }
    }
  }
  else 
  	i = -1;

  if(e.which==38  && login!=1){

    if(counter>=0){
      if(counter==array.length -1){
        temp_command = command;
      }
      
      $('textarea').val(array[counter]);
      command = array[counter];
      counter-=1;
    }
    else{
      var temp = $('textarea').focus().val();
      $('textarea').val('').val(temp);
    }

    $('#live').html(command);        
    $('#live2').html('');
    $('.cursor').html('&nbsp');
    return;
  }

  else if(e.which==40  && login!=1){

    if(counter<array.length-2){
      $('textarea').val(array[counter+2]);
      command = array[counter+2];
      counter+=1;
    }

    else if(counter==array.length-2){
      $('textarea').val(temp_command);
      command = temp_command;
      counter+=1;
      $('#live2').html('');
    }

    else{
      var temp = $('textarea').focus().val();
      $('textarea').val('').val(temp);
    }

    $('#live').html(command);
    $('#live2').html('');
    $('.cursor').html('&nbsp');
    return;
  }

  else if(e.which==37 || e.which==39){ 

    var index = $('textarea').prop("selectionStart");
    var prev = command.substring(0, index);
    $('#live').html(prev);

    if((prev==command) && (i == -1 || array.length == 0)){
      $('.cursor').html('&nbsp');
      $('#live2').html('');
    }
    else if((prev!=command) && (i == -1 || array.length == 0)){
      $('.cursor').html(command[index]);
      $('#live2').html(command.substring(index+1, command.length));
    }
    else if((i!=1 || array.length != 0) && (command!=array[i].substring(0, array[i].length)) && (e.which==39))
    {
      $('textarea').val(array[i]);
      command = array[i];
      $('#live').html(command);
      $('#live2').html('');
      $('.cursor').html('&nbsp');
    }
    else if(prev == command) {
      $('.cursor').html('&nbsp');
    }
    return;
  }

  else if(e.which==13  && login!=1){

    if(command=="clear"){
      $('.terminal-output').empty();
      $('.terminal-output').append(clear);
      reset();
    }

    else if(command=="help"){
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
      $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>List of commands<br> signup - to signup<br> \
       login - to login into the terminal<br>\
       clear - to clear screen<br>\
       logout - to logout of session<br>\
       press ctrl + c - to abort a currently running process<br>\
       mkdir - to create directory or folder<br>\
       cd - to change the directory<br>\
       rm -r - to delete an existing directory or folder<br>\
       ls - to list the files in a directory<br>\
       </span></div></div><br>');
      reset();
    }

    else if(command.split(" ")[0].trim()=="mkdir")
    {
      if(command.split(" ").length == 1) {
        if(directory=="")
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
         else
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');

        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>mkdir: missing operand &ltfolder name&gt </span></div></div><br>');
        reset();
      }
      else {
        $.ajax({
          type:'get',
          datatype :'json',
          data:{nameFolder: command.split(" ")[1].trim(), directory : directory},
          url:"/mkdir"
        }).done(function(data){
          if(data.value == 1)
          {
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' +  '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');

              reset();
          }
          else if(data.value == -1) {
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + data.error + '</span></div></div><br>');
              reset();
          }
          else if(data.value == 2)
          {
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
              else
               $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' +"cannot create a directory : permission denied" + '</span></div></div><br>');
              reset();
          }
          else 
          {
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first.</span></div></div><br>');
              reset();
          }
            
        }).fail(function(jqXHR,exception){
           $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');         
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
              if (data) console.error(data)
              else console.log('Success!')
              }
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>mkdir: cannot create directory "'+ command.slice(5) + '"  : ' + msg + '</span></div></div><br>');
              reset();
        });
      }
    }
    else if(command.includes("rm -r")==true && command.split(" ")[0] == "rm" && command.split(" ")[1] == "-r")
    {
      if(command.split(" ").length == 2) {
        if(directory=="")
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
         else
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>rm -r: missing operand &ltfolder name&gt </span></div></div><br>');
        reset();
      }
      else {
        $.ajax({
          type:'get',
          datatype :'json',
          data:{nameFolder: command.split(" ")[2].trim(), directory: directory},
          url:"/delete"
        }).done(function(data){
          if(data.value == 1)
          {   
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' +  '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
               reset();
          }
          else if(data.value == -1) {
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + data.error + '</span></div></div><br>');
              reset();
          }
          else if(data.value == 2) {
             if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>rm: cannot remove '+ '\''+ command.split(" ")[2].trim() +'\'' +': No such file or directory</span></div></div><br>');
             reset();
          }
          else if(data.value == 0) 
          {
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first.</span></div></div><br>');
              reset();
          }
          else
          {
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
              else
               $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>rm: cannot remove '+ '\''+ command.split(" ")[2].trim() +'\'' +': permission denied</span></div></div><br>');
              reset();
          }

        }).fail(function(jqXHR,exception){
           $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');         
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connected.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
              if (data) console.error(data)
              else console.log('Success!')
              }
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>mkdir: cannot delete directory "'+ command.slice(5) + '"  : ' + msg + '</span></div></div><br>');
              reset();
        });
      }
    }
    else if(command=="signup"){

      if(logged)
      {
         $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to logout first</span></div></div><br>');
        reset();
      }
      else 
      {        
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
       reset();
       window.open('signup', '_blank');
      }
      return;
    }
    else if(command=="login"){

      if(!logged){
        $('#root').hide();
        $('.prompt').append('<span id="email">email:</span>');  
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
        reset();
        login = 1;
        email = 1; 
      }
      else{
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>Already logged in.</span></div></div><br>');
        reset();
      }
    }
    else if(command.split(" ")[0].trim()=="cd")
    {
      if(!logged)
      {
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first.</div><br>');
          reset();  
      }
      else
      {
          if((command.split(" ").length == 1) || command.split(" ")[1].trim() == "")
          {
            
            if(directory == "")
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + '$ </span><span>' + command + '</span></div></div>');
            else
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
            
            directory ="";
            $('#root').html('root@' + username + ': ~'  + '$ ');
            $('textarea').focus();
            reset();
          }
          else
          {
            var name = command.split(" ")[1].trim();
            if(name=="." || name=="./") {
        	  if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              if(directory=="")
                $('#root').html('root@' + username + ': ~' + directory  + '$ ');
              else
                $('#root').html('root@' + username + ': ~/' + directory  + '$ ');
                $('textarea').focus();
              reset();
            } 
            else if(name==".." || name=="../")
            {
              var bits = directory.split("/");
              var changeDir = "";
              for(var count =0;count<bits.length-1;count++)
              {
                if(changeDir=="")
                  changeDir =  bits[count];
                else
                  changeDir = changeDir + "/" + bits[count];

              }            
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
              
              directory=changeDir;
              if(directory=="")
                $('#root').html('root@' + username + ': ~' + directory  + '$ ');
              else
                $('#root').html('root@' + username + ': ~/' + directory  + '$ ');
                $('textarea').focus();
              reset();
            }
            else
            {

              $.ajax({
                type:'get',
                datatype :'json',
                data:{nameofdir: name,directory : directory},
                url:"/cd"
              }).done(function(data){
                if(data.value == 1)
                {
                  if(directory == "")
                  {  

                    $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
                    directory = data.string;
                  }
                  else
                  {
                    $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
                    directory = data.string;
                  }

                  if(directory=="")
                    $('#root').html('root@' + username + ': ~' + directory  + '$ ');
                  else
                    $('#root').html('root@' + username + ': ~/' + directory  + '$ ');
                  $('textarea').focus();
                  reset();                        
                }
                else if(data.value == -1) {
                  if(directory=="")
                  {

                    $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
                    $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + "bash: cd:" +  name +": No such file or directory" +'</span></div></div><br>');
                  }
                  else
                  {

                    $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
                    $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>' + "bash: cd:" + name +": No such file or directory" +'</span></div></div><br>');
                  }
                  reset();
                }
                else 
                {
                  if(directory=="")
                    $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
                  else
                      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');
                  
                  $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>cannot change directory : Permission denied</span></div></div><br>');
                  if(directory=="")
                    $('#root').html('root@' + username + ': ~' + directory +  '$ ');
                  else
                    $('#root').html('root@' + username + ': ~/' + directory +  '$ ');
                  $('textarea').focus();
                  reset();
                }          
              }).fail(function(jqXHR,exception){
              if(directory=="")
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');         
              else
                $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');         

              var msg = '';
              if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
              } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
              } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
              } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
              } else if (exception === 'timeout') {
                msg = 'Time out error.';
              } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
              } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
              if (data) console.error(data)
              else console.log('Success!')
              }
            $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>cd: cannot change the directory "'+ command.slice(2) + '"  : ' + msg + '</span></div></div><br>');
            reset();
          }); 
        }
      }}
           
    }

    else if(command=="ls"){

      if(!logged)
      {
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first</span></div></div><br>');
        reset();
      }
      else 
      {        
        $.ajax({
        type:'get',
        datatype :'json',
        data:{ username : username , directory : directory},   
        url:"/ls"
        }).done(function(data){
            if(directory=="")
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory+ '$ </span><span>' + command + '</span></div></div>'); 
            else  
              $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory+ '$ </span><span>' + command + '</span></div></div>'); 

            for(num = 0;num < data.value.length ;num++)
            {
                $('.terminal-output').append('<div class="folder"><div style="width: 100%;"><span> ' + data.value[num] + '</span></div></div>');

            }              
            $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span><br></span></div></div>');            
            reset();

        }).fail(function(jqXHR,exception){
            $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
                
            var msg = '';
            if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') { 
              msg = 'Time out error.';
            } else if (exception === 'abort') {
              msg = 'Ajax request aborted.';
            } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
            if (data) console.error(data)
            else console.log('Success!')
          }
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>ls: cannot list files "'+ command.slice(2) + '"  : ' + msg + '</span></div></div><br>');
          reset();
      });
      }
    }

    else if(command=="logout"){
        if(logged)
        {
          window.location = '/logout';
          reset();
          return;
        }
        else
        {
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first.</span></div></div><br>');
          reset();
          return;
        }
    }

    else{
        if(directory=="")
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
        else if(directory=="/")
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~' + directory + '$ </span><span>' + command + '</span></div></div>');
        else
          $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~/' + directory + '$ </span><span>' + command + '</span></div></div>');

        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>No command \''+command+'\' found.</span></div></div><br>');
        $('textarea').val('');
        $('#live').html('');
        $('#live2').html('');
        $('.cursor').html('&nbsp');
    }

    if(command.length>0){
      array.push(command);
      temp_command = '';
    }                                                                                    
    counter=array.length-1;
    return;
  }

  else if(e.which==67 && ctrl)
  {
    if((email==1) || (password==1))
    {
      $('#email').remove();
      $('#root').show();
      email=0;
      login=0;
      password = 0;
    }
    else {
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '^C' + '</span></div></div>');
    }
    reset();
    return;
  }

  else if(e.which==9 )
  {
    if(logged)
    {

      var command = $('textarea').val();
      if(command== "")
      {
          
        $.ajax({
          type:'get',
          datatype :'json',
          data:{}, 
          url:"/tabPress"
          }).fail(function(jqXHR,exception){
            $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
                
            var msg = '';
            if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') { 
              msg = 'Time out error.';
            } else if (exception === 'abort') {
              msg = 'Ajax request aborted.';
            } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
            if (data) console.error(data)
            else console.log('Success!')
          }
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>ls: cannot list files "'+ command.slice(2) + '"  : ' + msg + '</span></div></div><br>');
          reset();
      });
      }
      else
      {
        // Autocompletes folders for cd and rm -r command.
        if(command.split(" ")[0].trim()=="cd" || ((command.includes("rm -r")==true && command.split(" ")[0] == "rm" && command.split(" ")[1] == "-r")) )
        {
          if((command.split(" ")[0].trim()=="cd")==true)
          {
            name_autoPred=command.split(" ")[1].trim();
          }
          else
          {
            name_autoPred=command.split(" ")[2].trim();
          }

        $.ajax({
          type:'get',
          datatype :'json',
          data:{ username : username , directory : directory,name_autoPred:name_autoPred}, 
          url:"/autoprediction"
          }).done(function(data){
            if(data.value == 1)
            {   
              // There is only one predicted file/folder then autocomplete the file/folder name.
              if(data.files.length == 1)
              {
                if((command.split(" ")[0].trim()=="cd"))
                {
                  var predict_folder="cd ";
                  if(directory=="")
                  {
                    var currentDir = data.dir;
                  }   
                  else
                  {
                    var currentDir = data.dir.substr(directory.length+1,data.dir.length);
                  }

                  if(currentDir!="/")
                    predict_folder = predict_folder + currentDir;
                  predict_folder += data.files[0];
                  $('textarea').val('');
                  $('textarea').val(predict_folder);
                  $('#live').html(predict_folder);
                  $('.cursor').html('&nbsp');
                }
                else
                {
                  var predict_folder="rm -r ";
                  var currentDir = data.dir.substr(directory.length,data.dir.length);
                  if(currentDir!="/")
                  {
                    predict_folder = predict_folder +  currentDir;
                  }
                  predict_folder += data.files[0];
                  $('textarea').val(predict_folder);
                  $('#live').html(predict_folder);
                  $('.cursor').html('&nbsp');
                }            
              }
              else
              {
                if(directory=="")
                  $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username +  ': ~' + directory + '$ </span><span>' + command + '</span></div></div>'); 
                else  
                  $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username  +': ~/' + directory + '$ </span><span>' + command + '</span></div></div>'); 

                for(num = 0;num < data.files.length ;num++)
                {
                  $('.terminal-output').append('<div class="folder"><div style="width: 100%;"><span> ' + data.files[num] + '</span></div></div>');
                }
                $('.terminal-output').append('<div class="result"><div style="width: 100%;"><br><span></span></div></div>');    
                if(directory=="")
                {
                  $('#root').html('root@' + username + ': ~' + directory + '$ '); 
                }     
                else 
                {
                  $('#root').html('root@' + username + ': ~/' + directory + '$ ' );
                }
              }   
            }
            //Else if no folder or file mathces.
            //Nothing will shown on terminal.
            //Only beep sound works.  
        }).fail(function(jqXHR,exception){
            $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
                
            var msg = '';
            if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') { 
              msg = 'Time out error.';
            } else if (exception === 'abort') {
              msg = 'Ajax request aborted.';
            } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText;
            if (data) console.error(data)
            else console.log('Success!')
          }
          $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>ls: cannot list files "'+ command.slice(2) + '"  : ' + msg + '</span></div></div><br>');
          reset();
      });
      }
    }
  }
    else
    {
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@' + username + ': ~$ </span><span>' + command + '</span></div></div>');
      $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>You need to login first</span></div></div><br>');
      reset();

    }
    
    
  }

  else if((e.which==40 || e.which==38)  && login==1){
    var temp = $('textarea').focus().val();
    $('textarea').val('').val(temp);
    $('#live').html(command);
    $('#live2').html('');
    $('.cursor').html('&nbsp');
  } 

  else if(e.which==13  && email==1){
    em = command;
    $('#email').html('password: ');
    email = 0;
    password = 1;
    reset();
  }

  else if(e.which==13  && password==1){
    $('#email').remove();
    $('#root').show();
    //Post request to login using em and command value
    login = 0;
    password = 0;
    reset();
    $.ajax({
    type:'post',
    datatype :'json',
    data:{email:em, password:command},
    url:'/login'
  }).done(function(data){
    if(data.value=='1'){
      username = data.name;
      logged = 1;
      $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>Logged in.</span></div></div><br>');    
      $('#root').html('root@' + username + ': ~$ ');
    }
    else{
      $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>Login failed.</span></div></div><br>');    
    }
  }).fail(function(data){
    console.log("internal error :" + data);
  });
  em = ""
  }

  else if(password!=1){
    $('#live').html('');
    if(i == -1 || array.length == 0){
        $('#live').append($('textarea').val().substring(0,$('textarea').prop("selectionStart")));
        if($('textarea').prop("selectionStart") == command.length) {
          $('#live2').html('');
          $('.cursor').html('&nbsp');
        }
    }
    else {
        $('#live').html(command);
        var index = $('textarea').prop("selectionStart");
        $('.cursor').html("<font color='yellow'>" + array[i].substring(index, index+1)  + "</font>" );
        $('#live2').html("<font color='yellow'>" + array[i].substring(index+1, array[i].length)  + "</font>" );
        if(command==array[i].substring(0, array[i].length))
        {
          $('.cursor').html('&nbsp');
        }
    }
  }

});
