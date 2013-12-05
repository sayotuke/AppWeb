var mongoose = require('mongoose');
var classroom = require('../model/teacher');
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

exports.add = function(req, res){
    var test = new Teacher({id: 1, first_name: "Test", last_name: "Test"});
    test.save();
    res.json("ok");

};