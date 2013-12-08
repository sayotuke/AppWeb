var mongoose = require('mongoose');
var teacher = require('../model/teacher');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAll = function(req, res){
    Teacher.find({}).exec(function(err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : "+err);
            res.send("erreur");
        };
    });
};

exports.find = function(req, res){
    Teacher.find({}).exec(function(err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : "+err);
            res.send("erreur");
        };
    });
};

exports.add = function(req, res){
    var last_name = req.body.last_name;
    var first_name = req.body.first_name;
    var temp = new Teacher({last_name: last_name, first_name: first_name});
    temp.save();
    res.json(temp);
};

exports.edit = function(req, res){
    var id = req.params.id;
    var last_name =req.params.last_name;
    var first_name = req.params.first_name;
    Teacher.findOne({_id: new ObjectId(id)}, function(err, doc){
        doc.last_name = last_name;
        doc.first_name = first_name;
        doc.save();
    });
    res.json("ok");
};

exports.delete = function(req, res){
    var id = req.params.id;
    Teacher.find({_id: new ObjectId(id)}).remove(function(err) {
        if(!err){res.json("ok");}
        else {
            console.log("erreur de delete : "+err);
            res.json("ko");
        }
    });
};
