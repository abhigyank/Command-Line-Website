const fse = require('fs-extra');

const deleteDir = function myFunction(directory,username){

	try{
		 fse.removeSync('./user_data/' + username + "/" +  directory);
	}
   catch (e) {
    return (e);
  }
  
}

module.exports = {
  deleteDir
}