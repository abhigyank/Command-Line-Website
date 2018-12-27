const fs = require('fs');

// function that makes a directory for mkdir command
const makeDir = (directory) => {
	// mkdir code goes here

	if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
}
}

module.exports = {
	makeDir
}
