var mongoose = require('mongoose');
var classroom = require('../model/classroom');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAll = function(req, res){
        Classroom.find({}).exec(function(err, result) {
            if (!err) {
                res.json(result);
            } else {
                console.log("erreur lors du find : "+err);
                res.send("erreur");
            };
        });
};

exports.findByName = function(name){
    console.log("voici name : "+name);
    Classroom.findOne({name: name}).exec(function(err, result) {
        if (!err) {
            console.log("voici result : "+result);
            if(result!==null)
            {
                console.log("classroom déjà là");
                return result._id;
            }
            else
            {
                console.log("je vais save");
                temp = new Classroom({name: name});
                temp.save();
            }
        } else {
            console.log("erreur lors du find : "+err);
            return -1;
        };
    });

};

exports.add = function(req, res){
    var name = req.body.name;
    var temp = new Classroom({name: name});
    temp.save();
    res.json(temp);
};

exports.edit = function(req, res){
    var id = req.params.id;
    var name =req.params.name;
    Classroom.findOne({_id: new ObjectId(id)}, function(err, doc){
        doc.name = name;
        doc.save();
    });
    res.json("ok");
};

exports.delete = function(req, res){
    var id = req.params.id;
    Classroom.find({_id: new ObjectId(id)}).remove(function(err) {
        if(!err){res.json("ok");}
        else {
            console.log("erreur de delete : "+err);
            res.json("ko");
        }
    });
};
