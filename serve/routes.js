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

}