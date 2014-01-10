/*
  Controller des horaires
 */
var mongoose = require('mongoose');
var schedule = require('../model/schedule');
var ObjectId = require('mongoose').Types.ObjectId;

/*
Retourne tous les horaires de la DB
 */
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

/*
Retourne un horaire avec un id précis
 */
exports.find = function (req, res) {
    Schedule.find({_id: new ObjectId(req.params._id)}).exec(function (err, result) {
        if (!err) {
            res.json(result);
        } else {
            console.log("erreur lors du find : " + err);
            res.send("erreur");
        }
    });
};

/*
 Ajout d'un horaire dans la DB
 */
exports.add = function (req, res) {
    var teachers = req.body.teachers;
    var classroom = req.body.classroom;
    var course = req.body.course;
    var promotion = req.body.promotion;
    var color = req.body.color;
    if (req.body.data !== null)var date = new Date(req.body.date);
    var begin = req.body.begin;
    var end = req.body.end;
    //Ajout d'un horaire
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
    //Ajout d'un modèle d'horaire
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

/*
Edition d'un horaire dans la DB
 */
exports.edit = function (req, res) {
    var id = req.params.id;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = req.params.begin;
    var end = req.params.end;
    Schedule.findOne({_id: new ObjectId(id)}, function (err, doc) {
        doc.begin = begin;
        doc.end = end;
        doc.date = new Date(year, month, day);
        doc.save();
    });
    res.json("ok");
};

/*
Suppression d'un horaire dans la DB
 */
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

/*
Retourne les tranches d'heurs déjà prises par un groupe
 */
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

/*
Retourne tous les modèles d'horaire
 */
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

/*
Retour le total d'heure d'un professeur
 */
exports.getTeacherTotalHour = function (req, res) {
    var id_teacher = req.params.id_teacher;
    var total = 0;
    Schedule.find({teachers: id_teacher, date: {$ne:null}})
        .exec(function (err, result) {
            if (!err) {
                for(var index in result)
                {
                    total+=(result[index].end - result[index].begin)+1;
                }
                res.json(total);
            } else {
                console.log("erreur getTeachersTotalHour : " + err);
                res.send("erreur");
            }
        });
};

/*
Retourne le total d'heure d'un professeur par rapport à un cours
 */
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

/*
Retourne le total d'heure d'un groupe par rapport à un cours
 */
exports.getPromotionTotalHourByCourse = function (req, res) {
    var id_promotion = req.params.id_promotion;
    var id_course = req.params.id_course;
    var total = 0;
    Schedule.find({promotion: id_promotion, course: id_course,date: {$ne:null}})
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

/*
Retourne true si le local est déjà pris, false si le local est libre
 */
exports.isClassroomTaken = function (req, res) {
    var id_classroom = req.params.id_classroom;
    var id_course = req.params.id_course;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    Schedule.find({classroom: id_classroom, date: new Date(year, month, day)}, 'begin end course')
        .exec(function (err, result) {
            if (!err) {
                if (result !== null && result.length>=1) {
                    //Ensemble des tranches horaires d'une journée, on va remplir les tranches horaires en fonction du résultat de la DB
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
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                            }
                        }
                    }
                    var diff = end - begin;
                    /*
                    On parcourt l'ensemble des tranches horaires depuis la tranche de début de l'horaire qu'on essaye d'insérer
                    jusque à sa tranche de fin, si on trouve la moindre tranche prise, on renvoie false
                     */
                    for (var i = begin - 1; i < slots.length; i++) {
                        var libre = true;
                        for (var j = i; j <= diff + i; j++) {
                            //Tranche prise, pas libre
                            if (slots[j].taken === true) {
                                if (slots[j].course+"" !== id_course+"") {
                                    libre = false;
                                    break;
                                }
                            }
                        }
                        if (libre) {
                            res.json(false);
                            break;
                        }
                        else {
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

/*
Retourne true si le local est pris, false si il est libre
 */
exports.isClassroomTakenCSV = function (req, callback) {
    var id_classroom = req.params.id_classroom;
    var id_course = req.params.id_course;
    var id_promotion = req.params.id_promotion;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    Schedule.find({classroom: id_classroom, date: new Date(year, month, day)}, 'begin end course promotion')
        .exec(function (err, result) {
            if (!err) {

                if (result !== null && result.length>=1) {
                    //Ensemble des tranches horaires d'une journée, on va remplir les tranches horaires en fonction du résultat de la DB
                    var slots = Array(
                        {id: 1, taken: false, course: null, promotion: null},
                        {id: 2, taken: false, course: null, promotion: null},
                        {id: 3, taken: false, course: null, promotion: null},
                        {id: 4, taken: false, course: null, promotion: null},
                        {id: 5, taken: false, course: null, promotion: null},
                        {id: 6, taken: false, course: null, promotion: null},
                        {id: 7, taken: false, course: null, promotion: null},
                        {id: 8, taken: false, course: null, promotion: null});
                    for (var index in result) {
                        if (result[index].begin === result[index].end) {
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                            slots[result[index].begin - 1].promotion = result[index].promotion;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                                slots[i].promotion = result[index].promotion;
                            }
                        }
                    }

                    var diff = end - begin;
                    /*
                     On parcourt l'ensemble des tranches horaires depuis la tranche de début de l'horaire qu'on essaye d'insérer
                     jusque à sa tranche de fin, si on trouve la moindre tranche prise, on renvoie false
                     */
                    for (var i = begin - 1; i < slots.length; i++) {
                        var libre = true;
                        for (var j = i; j <= diff + i; j++) {
                            if (slots[j].taken === true) {
                                if (slots[j].course+"" !== id_course+"") {
                                    libre = false;
                                    break;
                                }
                                else
                                {
                                    //Le même groupe dans le même local à la même heure avec le même cours, pas libre donc car déjà présent
                                    if(slots[j].promotion+"" === id_promotion+"")
                                    {
                                        libre=false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (libre) {
                            callback(false);
                            break;
                        }
                        else {
                            callback(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce local à cette date donc libre
                else {
                    callback(false);
                }
            } else {
                console.warn("erreur lors du find : " + err);
            }
        });
};

/*
Retourne true si un professeur est déjà pris, false si un professeur est libre
 */
exports.isTeacherTaken = function (req, res) {
    var teachers = req.params.teachers;
    var teachersTab = teachers.split(",");
    var id_course = req.params.id_course;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    if(teachers!==null || teachers.lenght===0){
        res.json(false);
    }
    else{
    Schedule.find({teachers: {$in: teachersTab, $ne:null}, date: new Date(year, month, day)}, 'begin end course promotion')
        .exec(function (err, result) {
            if (!err) {
                //Ensemble des tranches horaires d'une journée, on va remplir les tranches horaires en fonction du résultat de la DB
                if (result !== null && result.length>=1) {
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
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                            }
                        }
                    }

                    var diff = end - begin;
                    /*
                     On parcourt l'ensemble des tranches horaires depuis la tranche de début de l'horaire qu'on essaye d'insérer
                     jusque à sa tranche de fin, si on trouve la moindre tranche prise, on renvoie false
                     */
                    for (var i = begin - 1; i < slots.length; i++) {
                        var libre = true;
                        for (var j = i; j <= diff + i; j++) {
                            if (slots[j].taken === true) {
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
                            res.json(false);
                            break;
                        }
                        else {
                            res.json(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce professeur à cette date donc libre
                else {
                    res.json(false);
                }
            } else {
                console.log("erreur lors du find : " + err);
            }
        });
    }
};

/*
Retourne true si un professeur est déjà pris, false si il est libre
 */
exports.isTeacherTakenCSV = function (req, callback) {
    var teachersTab = req.params.teachers;
    var id_course = req.params.id_course;
    var id_promotion = req.params.id_promotion;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    Schedule.find({teachers: {$in: teachersTab, $ne:null}, date: new Date(year, month, day)}, 'begin end course promotion')
        .exec(function (err, result) {
            if (!err) {
                //Ensemble des tranches horaires d'une journée, on va remplir les tranches horaires en fonction du résultat de la DB
                if (result !== null && result.length>=1) {
                    var slots = Array(
                        {id: 1, taken: false, course: null, promotion: null},
                        {id: 2, taken: false, course: null, promotion: null},
                        {id: 3, taken: false, course: null, promotion: null},
                        {id: 4, taken: false, course: null, promotion: null},
                        {id: 5, taken: false, course: null, promotion: null},
                        {id: 6, taken: false, course: null, promotion: null},
                        {id: 7, taken: false, course: null, promotion: null},
                        {id: 8, taken: false, course: null, promotion: null});
                    for (var index in result) {
                        if (result[index].begin === result[index].end) {
                            slots[result[index].begin - 1].taken = true;
                            slots[result[index].begin - 1].course = result[index].course;
                            slots[result[index].begin - 1].promotion = result[index].promotion;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                slots[i].taken = true;
                                slots[i].course = result[index].course;
                                slots[i].promotion = result[index].promotion;
                            }
                        }
                    }
                    console.log(slots);

                    var diff = end - begin;
                    /*
                     On parcourt l'ensemble des tranches horaires depuis la tranche de début de l'horaire qu'on essaye d'insérer
                     jusque à sa tranche de fin, si on trouve la moindre tranche prise, on renvoie false
                     */
                    for (var i = begin - 1; i < slots.length; i++) {
                        var libre = true;
                        for (var j = i; j <= diff + i; j++) {
                            //console.log(j);
                            if (slots[j].taken === true) {
                                if (slots[j].course+"" !== id_course+"") {
                                    libre = false;
                                    break;
                                }
                                else
                                {
                                    //Le même groupe avec le même local à la même heure avec le même cours, pas libre donc car déjà présent
                                    if(slots[j].promotion+"" === id_promotion+"")
                                    {
                                        libre=false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (libre) {
                            callback(false);
                            break;
                        }
                        else {
                            callback(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce local à cette date donc libre
                else {
                    callback(false);
                }
            } else {
                console.log("erreur lors du find : " + err);
            }
        });
};

exports.isPromotionTakenCSV = function (req, callback) {
    var id_promotion = req.params.id_promotion;
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    var begin = parseInt(req.params.begin);
    var end = parseInt(req.params.end);
    Schedule.find({promotion: id_promotion, date: new Date(year, month, day)}, 'begin end')
        .exec(function (err, result) {
            if (!err) {
                //Ensemble des tranches horaires d'une journée, on va remplir les tranches horaires en fonction du résultat de la DB
                if (result !== null && result.length>=1) {
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
                            slots[result[index].begin - 1].taken = true;
                        }
                        else {
                            var diff = result[index].end - result[index].begin;
                            for (var i = result[index].begin - 1; i <= diff + result[index].begin - 1; i++) {
                                slots[i].taken = true;
                            }
                        }
                    }

                    var diff = end - begin;
                    /*
                     On parcourt l'ensemble des tranches horaires depuis la tranche de début de l'horaire qu'on essaye d'insérer
                     jusque à sa tranche de fin, si on trouve la moindre tranche prise, on renvoie false
                     */
                    for (var i = begin - 1; i < slots.length; i++) {
                        var libre = true;
                        for (var j = i; j <= diff + i; j++) {
                            if (slots[j].taken === true) {
                                    libre = false;
                                    break;
                            }
                            }

                        if (libre) {
                            callback(false);
                            break;
                        }
                        else {
                            callback(true);
                            break;
                        }
                    }

                }
                //aucun schedule pour ce local à cette date donc libre
                else {
                    callback(false);
                }
            } else {
                console.warn("erreur lors du find : " + err);
            }
        });
};

/*
Retourne l'ensemble des horaires pour une date précise
 */
exports.getSchedulesOfDate = function (req, res) {
    var day = req.params.day;
    var month = req.params.month;
    var year = req.params.year;
    Schedule.find({date: new Date(year, month, day)})
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

/*
Retourne l'ensemble des modèles d'horaire pour un groupe bien précis
 */
exports.getScheduleModelsOfPromotion = function (req, res) {
    Schedule.find({promotion: req.params.id_promotion, begin:null})
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

/*
Retourne true si un groupe est lié à au moins un horaire, sinon false
 */
exports.isPromotionLinked = function (req, res) {
    Schedule.findOne({promotion: req.params.id_promotion})
        .exec(function (err, result) {
            if (!err) {
                if(result)
                {
                    return res.json(true);
                }
                else res.json(false);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

/*
Retourne true si un local est lié à au moins un horaire, sinon false
 */
exports.isClassroomLinked = function (req, res) {
    Schedule.findOne({classroom: req.params.id_classroom})
        .exec(function (err, result) {
            if (!err) {
                if(result)
                {
                    return res.json(true);
                }
                else res.json(false);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

/*
Retourne true si un cours est lié à au moins un horaire, sinon false
 */
exports.isCourseLinked = function (req, res) {
    Schedule.findOne({course: req.params.id_course})
        .exec(function (err, result) {
            if (!err) {
                if(result)
                {
                    return res.json(true);
                }
                else res.json(false);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};

/*
Retourne true si un professeur est lié à au moins un horaire, sinon false
 */
exports.isTeacherLinked = function (req, res) {
    Schedule.findOne({teachers: {$in: req.params.id_teacher}})
        .exec(function (err, result) {
            if (!err) {
                if(result)
                {
                    return res.json(true);
                }
                else res.json(false);
            } else {
                console.log("erreur lors du find : " + err);
                res.send("erreur");
            }
        });
};








