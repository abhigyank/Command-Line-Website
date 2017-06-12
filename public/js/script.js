var clear = $('.terminal-output').html();
var array = [];
var counter = -1;
$(document).ready(function() {
  $('textarea').focus();
});
$('textarea').blur(function(){
  $('textarea').focus();
});
var temp_command = '';
function reset(){
  $('textarea').val('');
  $('#live').html('');
  $('#live2').html('');
  $('.cursor').html('&nbsp');
};
$('textarea').keyup(function(e) {
  var command = $('textarea').val();
  command = command.replace(/(\r\n|\n|\r)/gm,"");
  if(e.which==38){
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
  else if(e.which==40){
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
    if(prev==command)
      $('.cursor').html('&nbsp');
    else{
      $('.cursor').html(command[index]);
      $('#live2').html(command.substring(index+1, command.length))
    }
    return;
  }
  else if(e.which==13){
    if(command=="clear"){
      $('.terminal-output').empty();
      $('.terminal-output').append(clear);
      reset();
      return;
    }
    else if(command=="help"){
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root:~/ abhigyan$ </span><span>&gt;&nbsp;' + command + '</span></div></div>');
      $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>List of commands<br> signup - to signup<br> \
        login - to login into the terminal.<br>\
       clear - to clear screen\
       </span></div></div><br>');
      reset();
      return;
    }
    else if(command=="signup"){
      $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root:~/ abhigyan$ </span><span>&gt;&nbsp;' + command + '</span></div></div>');
      reset();
      window.location = "signup";
      return;
    }
    else{
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root:~/ abhigyan$ </span><span>&gt;&nbsp;' + command + '</span></div></div>');
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
  else{
    $('#live').html('');
    $('#live').append($('textarea').val().substring(0,$('textarea').prop("selectionStart")));
  }
});
