/* Your normal user model      ----------------------*/
var crypto = require('crypto');
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    PassportLocalStrategy = require('passport-local').Strategy;

schema = new mongoose.Schema({
    name: {type:String, required:true, trim:true},
    password: {type:String, required: true }
});

/* Auth properties      ---------------------------*/
/* (passport)           ---------------------------*/

// This is your main login logic
schema.statics.localStrategy = new PassportLocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
    },

    // @see https://github.com/jaredhanson/passport-local
    function (username, password, done){
        var User = require('./user');
        User.findOne({name: username}, function(err, user){
            if (err) {return done(err); }

            if (!user){
                return done(null, false, { message: 'User not found.'} );
            }
            if (!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.'} );
            }

            // I'm specifying the fields that I want to save into the user's session
            // *I don't want to save the password in the session
            return done(null, {
                id: user._id,
                name: user.name
            });
        });
    }
);

schema.methods.validPassword = function(password){
    var hashedPassword = crypto.createHash("sha1")
        .update(password)
        .digest("hex");
    console.log(hashedPassword);
    if (this.password == hashedPassword){
        return true;
    }

    return false;
}

schema.statics.serializeUser = function(user, done){
    done(null, user);
};

schema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

model = mongoose.model('user', schema);

module.exports = model;

/*
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
});

var User = mongoose.model('User', UserSchema);
*/