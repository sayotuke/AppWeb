var passport = require('passport');
var UsersController = {

    // Login a user
    login: passport.authenticate('local', {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failure'
    }),

    // on Login Success callback
    loginSuccess: function(req, res){
        res.json({
            success: true,
            user: req.session.passport.user
        });
    },

    // on Login Failure callback
    loginFailure: function(req, res){
        res.json({
            success:false,
            message: 'Invalid username or password.'
        });
    },

    // Log out a user
    logout: function(req, res){
        req.logout();
        res.end();
    }
};

exports = module.exports = UsersController;

/*
var mongoose = require('mongoose');
var user = require('../model/user');
var ObjectId = require('mongoose').Types.ObjectId;

exports.login = function(req, res){
    passport.use(
        new LocalStrategy(function(username, password,done){
        Users.findOne({ username : username},function(err,user){
            if(err) { return done(err); }
            if(!user){
                return done(null, false, { message: 'Incorrect username.' });
            }

            hash( password, user.salt, function (err, hash) {
                if (err) { return done(err); }
                if (hash == user.hash) return done(null, user);
                done(null, false, { message: 'Incorrect password.' });
            });
        });
    }));
}

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

function userExist(req, res, next) {
    Users.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            // req.session.error = "User Exist"
            res.redirect("/singup");
        }
    });
}     */