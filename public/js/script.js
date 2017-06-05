var clear = $('.terminal-output').html();
var array = [];
var counter = -1;
$(document).ready(function() {
  $('textarea').focus();
});
$('textarea').blur(function(){
  $('textarea').focus();
});
$('textarea').keyup(function(e) {
  var command = $('textarea').val();
  command = command.replace(/(\r\n|\n|\r)/gm,"");
  if(e.which==38){
    if(counter>=0){
      $('textarea').val(array[counter]);
      command = array[counter];
      counter-=1;
    }
    else{
      var temp = $('textarea').focus().val();
      $('textarea').val('').val(temp);
    }
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
      $('textarea').val('');
      $('#live').html('');
      $('#live2').html('');
      $('.cursor').html('&nbsp');
    }
    else{
        $('.terminal-output').append('<div class="command" role="presentation" aria-hidden="true"><div style="width: 100%;"><span class="user">root@abhigyan </span><span>&gt;&nbsp;' + command + '</span></div></div>');
        $('.terminal-output').append('<div class="result"><div style="width: 100%;"><span>result according to command</span></div></div>');
        $('textarea').val('');
        $('#live').html('');
        $('#live2').html('');
        $('.cursor').html('&nbsp');
    }
    if(command.length>0){
      array.push(command);
    }
    counter=array.length-1;
    return;
  }
  $('#live').html(command);
});
