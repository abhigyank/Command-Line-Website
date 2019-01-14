const fs = require('fs');

// function that makes a directory for mkdir command
const makeDir = function myFunction(directory,username){

  //If user _data is not created already
  if(!fs.existsSync("user_data"))
  {
      //create  folder 'user_data'
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



module.exports = {
  makeDir
}