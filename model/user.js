/*
 Schéma d'un utilisateur
 */
var crypto = require('crypto');
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    PassportLocalStrategy = require('passport-local').Strategy;

schema = new mongoose.Schema({
    name: {type:String, required:true, trim:true},
    password: {type:String, required: true }
});

// On récupère le login et le password
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

            //on sauve uniquement le nom et l'id de l'user en session
            return done(null, {
                id: user._id,
                name: user.name
            });
        });
    }
);

/*
Validation du password, le password est stocké sous form d'un hash sha-1 du password original
 */
schema.methods.validPassword = function(password){
    //On hash le password reçu par le formulaire
    var hashedPassword = crypto.createHash("sha1")
        .update(password)
        .digest("hex");
    //On compare les hashs
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
