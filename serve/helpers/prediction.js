const fs = require('fs');
//library for creating sound
const beep = require('beepbeep');

const ListFiles = function getFiles(foldername, path, predictedFolder){
  var files=[];
  var items=[];
  //Store the folders in files.
  files = fs.readdirSync(path);

  //For extracting folders 
  files.forEach(function(element)
  {

    if(element.substr(0,predictedFolder.length)==predictedFolder) 
      items.push(element);    
  });
  if(items.length==0)
    beep();
  return items;
}

const CreateSound = function beepSound(){
  beep();
}
module.exports = {
  ListFiles,
  CreateSound
}