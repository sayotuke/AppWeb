var mongoose = require('mongoose');
var schedule = require('../model/schedule');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAll = function (req, res) {
    Schedule.find({})
        .populate('classroom')
        .populate('teachers')
        .populate('course')
        .populate('promotion')
        .exec(function (err, result) {
            if (!err) {
                res.json(result);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
            ;
        });
};

exports.find = function (req, res) {
    Schedule.find({}).exec(function (err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : " + err);
            res.send("erreur");
        }
        ;
    });
};

exports.add = function (req, res) {
    var teachers = req.body.teachers;
    var classroom = req.body.classroom;
    var course = req.body.course;
    var promotion = req.body.promotion;
    var color = req.body.color;
    if (req.body.data !== null)var date = new Date(req.body.date);
    var begin = req.body.begin;
    var end = req.body.end;
    console.log(date);

    var temp;
    if (date !== null) {
        temp = new Schedule({
            teachers: teachers,
            classroom: classroom,
            course: course,
            promotion: promotion,
            color: color,
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            begin: begin,
            end: end
        });
    }
    else {
        temp = new Schedule({
            teachers: teachers,
            classroom: classroom,
            course: course,
            promotion: promotion,
            color: color,
            date: null,
            begin: null,
            end: null
        });
    }
    console.log(temp.date);
    temp.save();
    res.json(temp);
};

exports.edit = function (req, res) {
    var id = req.params.id;
    var name = req.params.name;
    Schedule.findOne({_id: new ObjectId(id)}, function (err, doc) {
        doc.name = name;
        doc.save();
    });
    res.json("ok");
};

exports.delete = function (req, res) {
    var id = req.params.id;
    Schedule.find({_id: new ObjectId(id)}).remove(function (err) {
        if (!err) {
            res.json("ok");
        }
        else {
            console.log("erreur de delete : " + err);
            res.json("ko");
        }
    });
};

exports.getSlotsTaken = function (req, res) {
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var promotion = req.params.promotion;
    Schedule.find({date: new Date(year, month, day), promotion: promotion})
        .populate('classroom')
        .populate('teachers')
        .populate('course')
        .populate('promotion')
        .exec(function (err, result) {
            if (!err) {
                console.log(result);
                res.json(result);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

exports.getScheduleModels = function (req, res) {
    Schedule.find({date: null})
        .populate('classroom')
        .populate('teachers')
        .populate('course')
        .populate('promotion')
        .exec(function (err, result) {
            if (!err) {
                console.log(result);
                res.json(result);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

exports.getTeacherTotalHour = function (req, res) {
    var id_teacher = req.params.id_teacher;
    var total = 0;
    Schedule.find({teachers: id_teacher, date: {'$ne':null}})
        .exec(function (err, result) {
            if (!err) {
                for(var index in result)
                {
                    total+=(result[index].end - result[index].begin)+1;
                }
                console.log(total);
                res.json(total);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

exports.getTeacherTotalHourByCourse = function (req, res) {
    var id_teacher = req.params.id_teacher;
    var id_course = req.params.id_course;
    var total = 0;
    Schedule.find({teachers: id_teacher, course: id_course,date: {'$ne':null}})
        .exec(function (err, result) {
            if (!err) {
                for(var index in result)
                {
                    total+=(result[index].end - result[index].begin)+1;
                }
                res.json(total);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

exports.getPromotionTotalHourByCourse = function (req, res) {
    var id_promotion = req.params.id_promotion;
    var id_course = req.params.id_course;
    var total = 0;
    Schedule.find({promotion: id_promotion, course: id_course,date: {'$ne':null}})
        .exec(function (err, result) {
            if (!err) {
                for(var index in result)
                {
                    total+=(result[index].end - result[index].begin)+1;
                }
                res.json(total);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};
