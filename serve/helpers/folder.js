const fs = require('fs');

// function that makes a directory for mkdir command
const makeDir = function myFunction(directory,username){
  // mkdir code goes here

  //If user _data is not created already
  if(!fs.existsSync("user_data"))
  {
      //create  folder 'user_data'
      fs.mkdirSync("user_data");
      if(!fs.existsSync('./user_data/' + username))
      {
        fs.mkdirSync('./user_data/' + username);
        if (!fs.existsSync('./user_data/' + username + "/" +  directory)){
          fs.mkdirSync('./user_data/' + username + "/" +  directory);
      }
      }

      else
      {
        if (!fs.existsSync('./user_data/' + username + "/" +  directory)){
          fs.mkdirSync('./user_data/' + username + "/" + directory);
      }
      }
      
  }
  else
  {
    //  
    if(!fs.existsSync('./user_data/' + username))
      {
        fs.mkdirSync('./user_data/' + username);
        if (!fs.existsSync('./user_data/' + username + "/" +  directory)){
          fs.mkdirSync('./user_data/' + username + "/" +  directory);
      }
      }
      else
      {
        if (!fs.existsSync('./user_data/' + username + "/" +  directory)){
          fs.mkdirSync('./user_data/' + username + "/" + directory);
      }
      }
  //    if (!fs.existsSync("./user_data/" +directory)){
  //      fs.mkdirSync("./user_data/" + directory);
    // }
  }
  
}

module.exports = {
  makeDir
}