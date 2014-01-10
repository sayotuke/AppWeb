/*
Controller des utilisateurs
 */

var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../model/user');
var ObjectId = require('mongoose').Types.ObjectId;

    //Login d'un utlisateur
    exports.login = passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/#/badLogin'
        });

    //Fonction appellée si le login est OK
    exports.loginSuccess= function(req, res){
        res.json({
            success: true,
            user: req.session.passport.user
        });
    };

    //Fonction appellée si le login s'est mal passé
    exports.loginFailure= function(req, res){
        res.json({
            success:false,
            message: 'Invalid username or password.'
        });
    };

    //Fonction pour se logout
    exports.logout=function(req, res){
        req.logout();
        res.end();
        //on redirige vers l'index aprés déconnexion
        res.redirect("/");
    };

    //Renvoie l'utilisateur en session
    exports.getSession = function(req, res)
    {
        res.json(req.session.passport.user);
    }
