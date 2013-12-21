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
    if (date !== null) {
        var temp = new Schedule({
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
            var temp = new Schedule({
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
                console.log("erreur getSlotsTaken : " + err);
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
                console.log("erreur getScheduleModel : " + err);
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
                console.log("erreur getTeachersTotalHour : " + err);
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

exports.isClassroomTaken = function (req, res) {
    var id_classroom = req.params.id_classroom;
    var id_course = req.params.id_course;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    console.log("begin : "+begin+" end : "+end);
    Schedule.find({classroom: id_classroom, date: new Date(year, month, day)}, 'begin end course')
        .exec(function (err, result) {
            console.log("resuuuult : " + result);
            if (!err) {

                if (result !== null) {
                    var slots = Array(
                        {id: 1, taken: false, course: null},
                        {id: 2, taken: false, course: null},
                        {id: 3, taken: false, course: null},
                        {id: 4, taken: false, course: null},
                        {id: 5, taken: false, course: null},
                        {id: 6, taken: false, course: null},
                        {id: 7, taken: false, course: null},
                        {id: 8, taken: false, course: null});
                    for (var index in result) {
                        if (result[index].begin === result[index].end) {
                            console.log("begin result : "+ result[index].begin+"end result "+result[index].end);
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            console.log("diiiiiif "+diff);
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                console.log("i = " + i);
                                console.log("result at index :" + result[index]);
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                            }
                        }
                    }
                    console.log(slots);

                    var diff = end - begin;
                    console.log("diff : " + diff);
                    for (var i = begin - 1; i < slots.length; i++) {
                        console.log("i : " + i);
                        var libre = true;
                        console.log("i+1 " + (i + 1));
                        console.log("diff+1 " + (diff + i));
                        for (var j = i; j <= diff + i; j++) {
                            console.log(j);
                            if (slots[j].taken === true) {
                                console.log(id_course);
                                console.log(slots[j].course);
                                //On doit passer les deux params en strings sinon il considère qu'ils ne sont pas égaux
                                //il les prend comme des objets je pense
                                if (slots[j].course+"" !== id_course+"") {
                                    libre = false;
                                    console.log('pas libre et j = ' + j);
                                    console.log("slots[j].course = "+slots[j].course+" et id_course = "+id_course);
                                    break;
                                }
                            }
                        }
                        if (libre) {
                            console.log("LIBRE");
                            res.json(false);
                            break;
                        }
                        else {
                            console.log("PAS LIBRE");
                            res.json(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce local à cette date donc libre
                else {
                    res.json(false);
                }
            } else {
                console.log("erreur lors du find : " + err);
            }
        });
};

exports.isTeacherTaken = function (req, res) {
    var teachers = req.params.teachers;
    var teachersTab = teachers.split(",");
    var id_course = req.params.id_course;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    console.log("begin : "+begin+" end : "+end);
    Schedule.find({teachers: teachersTab, date: new Date(year, month, day)}, 'begin end course')
        .exec(function (err, result) {
            console.log("resuuuult : " + result);
            if (!err) {

                if (result !== null) {
                    var slots = Array(
                        {id: 1, taken: false, course: null},
                        {id: 2, taken: false, course: null},
                        {id: 3, taken: false, course: null},
                        {id: 4, taken: false, course: null},
                        {id: 5, taken: false, course: null},
                        {id: 6, taken: false, course: null},
                        {id: 7, taken: false, course: null},
                        {id: 8, taken: false, course: null});
                    for (var index in result) {
                        if (result[index].begin === result[index].end) {
                            console.log("begin result : "+ result[index].begin+"end result "+result[index].end);
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            console.log("diiiiiif "+diff);
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                console.log("i = " + i);
                                console.log("result at index :" + result[index]);
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                            }
                        }
                    }
                    console.log(slots);

                    var diff = end - begin;
                    console.log("diff : " + diff);
                    for (var i = begin - 1; i < slots.length; i++) {
                        console.log("i : " + i);
                        var libre = true;
                        console.log("i+1 " + (i + 1));
                        console.log("diff+1 " + (diff + i));
                        for (var j = i; j <= diff + i; j++) {
                            console.log(j);
                            if (slots[j].taken === true) {
                                console.log(id_course);
                                console.log(slots[j].course);
                                //On doit passer les deux params en strings sinon il considère qu'ils ne sont pas égaux
                                //il les prend comme des objets je pense
                                if (slots[j].course+"" !== id_course+"") {
                                    libre = false;
                                    console.log('pas libre et j = ' + j);
                                    console.log("slots[j].course = "+slots[j].course+" et id_course = "+id_course);
                                    break;
                                }
                            }
                        }
                        if (libre) {
                            console.log("LIBRE");
                            res.json(false);
                            break;
                        }
                        else {
                            console.log("PAS LIBRE");
                            res.json(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce local à cette date donc libre
                else {
                    res.json(false);
                }
            } else {
                console.log("erreur lors du find : " + err);
            }
        });
};
