const fs = require('fs');
const fse = require('fs-extra');

const makeDir = function myFunction(directory,username){

  //If user _data is not created already
  if(!fs.existsSync("user_data"))
  {
      //create folder 'user_data'
    fs.mkdirSync("user_data");
  }
  if(!fs.existsSync('./user_data/' + username))
  {
    fs.mkdirSync('./user_data/' + username);
  }
  try {
    fs.mkdirSync('./user_data/' + username + "/" +  directory);
    return true;
  } 
  catch (e) {
    return (e);
  }
  
}

const deleteDir = function myFunction(directory,username){
  
  try{
      if(!fse.existsSync('./user_data/' + username + "/" +  directory))
      {
        return false;
      }
     fse.removeSync('./user_data/' + username + "/" +  directory);
     return true;
  }
  catch (e) {
    return (e);
  }
  
}

module.exports = {
  makeDir,
  deleteDir
}