const  makeDir  = require('./helpers/folder.js');
var fs = require('fs');
var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

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

	// Receives an ajax get request from the client site to create a folder
	// The request will contain the path where to create folder
	app.get('/mkdir', function(req, res) {
		if(req.isAuthenticated())
		{
			if(req.query.nameFolder[0]=="/")
			{
				res.send({ 
					value : 2 
				});
			}	
			else
			{
				if(!req.query.nameFolder.match(format)){

					var path_folder =   req.query.directory + '/' + req.query.nameFolder;

					// call makeDir function here with appropriate function paramters from req
					var response = makeDir.makeDir(path_folder,req.user.local.email);
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
		}		
		else
		{
			res.send({ 
				value : 0 
			});
		}
		
		// call makeDir function here with appropriate function paramters from req
			
			
    });

    app.get('/cd', function(req, res) {
    		var foldername = req.query.nameofdir;
    		
              if((foldername[0]=="/") || (foldername[0]=="." && foldername[1]=="/" && foldername[2]=="/"))
              {
               	res.send({
					value : 0
 
              	})
              }
              else
              {
              		
              		var path_folder =  './user_data/' + req.user.local.email  + '/' + req.query.directory +'/' + foldername;
					if(!req.query.nameofdir.match(format)){
						if(fs.existsSync(path_folder))
						{
					
							res.send({value : 1});
						}
						else
						{
					
							res.send({value : -1});	
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
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}