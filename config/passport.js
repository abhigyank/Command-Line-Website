var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user.js');


module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },function(req, email, password, done) {

        process.nextTick(function() {
            
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that username
            if (user) {
                return done(null, false);
            } else {
                var newUser = new User();

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.name = req.body.name;
                newUser.local.roll = req.body.roll;
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },function(req, email, password, done){
    	User.findOne({'local.email' : email }, function(err, user){
    		if(err)
    			return done(err);
    		if(!user || !user.validPassword(password))
    			return done(null, false);
 			
    		return done(null, user);
    	});
    }))	;

};
