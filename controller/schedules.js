
var mongoose = require('mongoose');
var schedule = require('../model/schedule');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAll = function(req, res){
    Schedule.find({}).exec(function(err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : "+err);
            res.send("erreur");
        };
    });
};

exports.find = function(req, res){
    Schedule.find({}).exec(function(err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : "+err);
            res.send("erreur");
        };
    });
};

exports.add = function(req, res){
    var teachers = req.body.teachers;
    var classroom = req.body.classroom;
    var course = req.body.course;
    var promotion = req.body.promotion;
    var date = req.body.date;
    var begin = req.body.begin;
    var end = req.body.end;

    var temp = new Schedule({
        teachers: teachers,
        classroom: classroom, course: course,
        promotion: promotion,
        date: date,
        begin: begin,
        end : end
    });
    temp.save();
    res.json(temp);
};

exports.edit = function(req, res){
    var id = req.params.id;
    var name =req.params.name;
    Schedule.findOne({_id: new ObjectId(id)}, function(err, doc){
        doc.name = name;
        doc.save();
    });
    res.json("ok");
};

exports.delete = function(req, res){
    var id = req.params.id;
    Schedule.find({_id: new ObjectId(id)}).remove(function(err) {
        if(!err){res.json("ok");}
        else {
            console.log("erreur de delete : "+err);
            res.json("ko");
        }
    });
};
