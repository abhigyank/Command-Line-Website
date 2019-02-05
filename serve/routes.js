const  DirFunctions  = require('./helpers/folder.js');
const fs = require('fs');
const path_module = require('path');
var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
const predictionFolder = require('./helpers/prediction.js');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index', {
			user: req.user
		});
	});
	app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        if(!req.isAuthenticated()){
	        res.render('signup', { errors: req.session.messages || [] });
    	    req.session.messages = [];
    	}
    	else{
    		res.redirect('/');
    	}
    });
	app.post('/signup',passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureMessage: 'Email already exists.'
	}));

	app.post('/login', function(req, res, next) {
		if (!req.isAuthenticated()){
			passport.authenticate('local-login', function(err, user, info) {
				if(err)
					return next(err);
				if(!user)
					return res.send('0');
				req.login(user, function(err){
	 			   if(err){
	   					return next(err);
	 				}
					return res.send({ value : '1', name : user.local.name });     
				});
			})(req, res, next);
		}
		else{
			res.send('0');
		}
	});

	// Receives an ajax get request from the client site to list the files in a directory
	// The request will contain the path where files has to list.
	app.get('/ls', function(req, res) {
		var path = "./user_data" +  "/"+ req.user.local.email + "/" + req.query.directory;
		fs.readdir(path ,function(err,items)
		{
			//return list of files contained in a folder.
    		return  res.send( { value : items });
		})

    });

	// Receives an ajax get request from the client site to create sound
    app.get('/tabPress', function(req, res) {
    	//call CreateSound function to create sound.
		predictionFolder.CreateSound();
		 return res.send({
			value : 1
		});

    });

    // Receives an ajax get request from the client site to list the files in a directory for prediction
	app.get('/autoprediction', function(req, res) {

		//path where directories has to list.
		var path="";
		//for changing multiple directories in one command.
		var dir="";
		var foldername= req.query.name_autoPred;
		if(foldername[0]=="/")
		{
			res.send({
				value:0
			})
		}
		else
		{

			var default_path =  './user_data/' + req.user.local.email;
            var user_path =  default_path + '/' + req.query.directory +'/';
            //Resolves specified path and stored in temp.
			var temp=path_module.resolve("",user_path,foldername);

			// This is needed in case the to be predicted text includes a / at end, then we have to look into the directory for all folders and files.
			if(foldername[foldername.length-1] == '/') temp+='/';

			foldername= temp.substr(__dirname.length-5,temp.length);
			//name of folder.
			// 11 == length of 'user_data/' and '/' after email.
			foldername = foldername.substr(11 + req.user.local.email.length+ req.query.directory.length ,temp.length); 
			if(foldername.includes("/")==true)
			{
				//actual path required to list directories.
				path = user_path + foldername.substr(0,foldername.lastIndexOf("/"));
				dir = req.query.directory + foldername.slice(0,foldername.lastIndexOf("/"));
            	dir += "/";
			}
			else
			{
				path = user_path;
				dir =req.query.directory + "/";
			}
		
        	var last_dir_of_foldername=foldername.slice(foldername.lastIndexOf("/")+1,foldername.length);
        	//list of folder names.
        	var response = [];
        	//Call ListFiles function properly to get the list of required folder names.
        	response = predictionFolder.ListFiles(foldername,path,last_dir_of_foldername);
        	if(response.length == 0)
        	{
        		res.send({
        			value : 0
        		})
        	}
        	else
        	{
        		res.send({
        			value : 1,
        			files : response,
        			dir : dir
        		});
        	}
		}
    });

	// Receives an ajax get request from the client site to create a folder
	// The request will contain the path where to create folder
	app.get('/mkdir', function(req, res) {
		if(req.isAuthenticated())
		{
			
			if(!req.query.nameFolder.match(format)){

				var path_folder =   req.query.directory + '/' + req.query.nameFolder;

				// call makeDir function here with appropriate function paramters from req
				var response = DirFunctions.makeDir(path_folder,req.user.local.email);
	      		if(response.constructor === Error){
	      			res.send({
	      				value: -1,
	      				error: response.message
	      			})
	      		}
	      		else {
	      			res.send({
	      				value: 1
	      			});
	      		}
	      	}
	      	else
	      	{
	      		res.send({ 
					value : 2 
				});
	    	}
		}		
		else
		{
			res.send({ 
				value : 0 
			});
		}
		
		// call makeDir function here with appropriate function parameters from req
		
    });

    app.get('/cd', function(req, res) {
    		//name of directory.
    		var foldername = req.query.nameofdir;
            if((foldername[0]=="/"))
            {
               	res.send({
					value : 0
 
              	})
            }
            else
            {
              	var default_path =  './user_data/' + req.user.local.email;
              	var user_path =  default_path + '/' + req.query.directory +'/';

            	// Initial Check whether path actualy exists or not
            	if(!fs.existsSync(user_path + foldername)) {
            		res.send({
							value : -1,
							string : foldername
					});	
					return;
            	}
            	// Resolves the specified paths into an absolute path
              	var path_folder =  path_module.resolve("", user_path, foldername);
              	path_folder = './' + path_folder.substr(__dirname.length - 5,path_folder.length);           
              	// Trying to access above the user folder
              	if(path_folder.length < default_path.length) {
					res.send({
						value : 0
					})
					return;
              	}

              	// Absolute directory path in user folder
              	foldername = path_folder.substr(default_path.length + 1, path_folder.length);
				if(!foldername.match(format) || foldername == "")
				{
					if(fs.existsSync(path_folder))
					{
					
						res.send({
							value : 1,
							string : foldername
						})
					}
					else
					{
					
						res.send({
							value : -1,
							string : foldername
						});	
					}	
				}	
				else
				{
					res.send({
						value : 0
					})
				}   
          	}	
		});
  
	app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/delete', function(req, res) {
		if(req.isAuthenticated())
		{
			if(!req.query.nameFolder.match(format)){
				var path_folder =   req.query.directory + '/' + req.query.nameFolder;
				var response = DirFunctions.deleteDir(path_folder, req.user.local.email);
		      	if(response.constructor === Error){
		      		res.send({
		      			value: -1,
		      			error: response.message
		      		})
		      	}
		      	else if(!response){
		      		res.send({
		      			value: 2
		      		})
		      	}
		      	else {
		      		res.send({
		      			value: 1
		      		});
		      	}
		    }
		    else{
		    	res.send({
		      		value: 3
		      	});
		    }
		}
		else
		{
			res.send({ 
				value : 0
			});
		}
		
		// call deleteDir function here with appropriate function paramters from req
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}