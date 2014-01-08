var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../model/user');
var ObjectId = require('mongoose').Types.ObjectId;

    // Login a user
    exports.login = passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/#/badLogin'
        });

    // on Login Success callback
    exports.loginSuccess= function(req, res){
        res.json({
            success: true,
            user: req.session.passport.user
        });
    };

    // on Login Failure callback
    exports.loginFailure= function(req, res){
        res.json({
            success:false,
            message: 'Invalid username or password.'
        });
    };

    // Log out a user
    exports.logout=function(req, res){
        req.logout();
        res.end();
        res.redirect("/");
    };

    exports.getSession = function(req, res)
    {
        console.log(req.session);
        console.log("------");
        console.log(req.session.user);
        res.json(req.session.passport.user);
    }
