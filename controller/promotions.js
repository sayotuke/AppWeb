/*
Controller des groupes
 */
var mongoose = require('mongoose');
var promotion = require('../model/promotion');
var ObjectId = require('mongoose').Types.ObjectId;

/*
Retourne tous les groupes présents dans la DB
 */
exports.findAll = function(req, res){
    Promotion.find({}).exec(function(err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : "+err);
            res.send("erreur");
        };
    });
};

/*
Ajout d'un groupe dans la DB
 */
exports.add = function(req, res){
    var name = req.body.name;
    var temp = new Promotion({name: name});
    temp.save();
    res.json(temp);
};

/*
Edition d'un groupe dans la DB
 */
exports.edit = function(req, res){
    var id = req.params.id;
    var name =req.params.name;
    Promotion.findOne({_id: new ObjectId(id)}, function(err, doc){
        doc.name = name;
        doc.save();
    });
    res.json("ok");
};

/*
Suppression d'un cours dans la DB
 */
exports.delete = function(req, res){
    var id = req.params.id;
    Promotion.find({_id: new ObjectId(id)}).remove(function(err) {
        if(!err){res.json("ok");}
        else {
            console.log("erreur de delete : "+err);
            res.json("ko");
        }
    });
};
