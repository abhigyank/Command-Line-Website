const  makeDir  = require('./helpers/folder.js');


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

	// Receives an ajax get request from the client site to create a folder
	// The request will contain the path where to create folder
	app.get('/mkdir', function(req, res) {
		if(req.isAuthenticated())
		{
			var response = makeDir.makeDir(req.query.nameFolder,req.user.local.email);
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
				value : 0 
			});
		}
		
		// call makeDir function here with appropriate function paramters from req
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