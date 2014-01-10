/*
Controller des locaux
 */
var mongoose = require('mongoose');
var classroom = require('../model/classroom');
var ObjectId = require('mongoose').Types.ObjectId;

/*
Retourne tous les locaux présents dans la DB
 */
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

/*
Retourne un local présent dans la DB avec un nom donné en paramètre
 */
exports.findByName = function(name){
    Classroom.findOne({name: name}).exec(function(err, result) {
        if (!err) {
            if(result!==null)
            {
                return result._id;
            }
            else
            {
                temp = new Classroom({name: name});
                temp.save();
            }
        } else {
            console.log("erreur lors du find : "+err);
            return -1;
        };
    });

};

/*
Ajoute un local dans la DB
 */
exports.add = function(req, res){
    var name = req.body.name;
    var temp = new Classroom({name: name});
    temp.save();
    res.json(temp);
};



/*
Edition d'un local dans la DB
 */
exports.edit = function(req, res){
    var id = req.params.id;
    var name =req.params.name;
    Classroom.findOne({_id: new ObjectId(id)}, function(err, doc){
        doc.name = name;
        doc.save();
    });
    res.json("ok");
};

/*
Suppression d'un local dans la DB
 */
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
