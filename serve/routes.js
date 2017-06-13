module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index');
	});
	 app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { errors: req.session.messages || [] });
        req.session.messages = [];
    });
	app.post('/signup',passport.authenticate('local-signup',{
		successRedirect: '/',
		failureRedirect: '/signup',
		failureMessage: 'Email already exists.'
	}));

	app.post('/login', function(req, res, next) {
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
	});
}