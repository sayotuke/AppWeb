/*
 Permet de gérer l'import de document csv
 */
var csv = require('csv');
var fs = require('fs');
var mongoose = require('mongoose');
var schedule = require('../model/schedule');
var schedules = require('./schedules');
var classroom = require('../model/classroom');
var teacher = require('../model/teacher');
var promotion = require('../model/promotion');
var course = require('../model/course');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');


/*
 Convertit un string en un code couleur utilisable
 */
function stringToColour(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}

/*
 Parcourt un document csv, insère les élèments non-présents dans la DB, importe les horaires dans la DB et génère un rapport de conflit
 */
exports.import = function (req, res) {
    var csvFileName = req.files.myFile.path;
    var schedulesFromCsv = Array();
    var conflicts = Array();
    var begins = Array("8:45", "9:45", "11:00", "12:00", "13:45", "14:45", "16:00", "17:00");
    var ends = Array("9:45", "10:45", "12:00", "13:00", "14:45", "15:45", "17:00", "18:00");
    csv()
        .from.stream(fs.createReadStream(csvFileName))
        .transform(function (row) {
            row.unshift(row.pop());
            return row;
        })
        //On stocke dans un tableau chaque ligne du csv
        .on('record', function (row, index) {
            var scheduleFromCsv = {};
            var temp = JSON.stringify(row).split(";");
            temp[0] = temp[0].substr(2);
            scheduleFromCsv.day = temp[0].substr(-2);
            scheduleFromCsv.month = temp[0].substr(4, 2);
            scheduleFromCsv.year = temp[0].substr(0, 4);
            temp[temp.length - 1] = temp[temp.length - 1].substr(0, temp[temp.length - 1].length - 2);
            scheduleFromCsv.begin = temp[1];
            scheduleFromCsv.end = temp[2];
            scheduleFromCsv.classroom = temp[3];
            scheduleFromCsv.teachers = temp[4];
            scheduleFromCsv.course = temp[5];
            scheduleFromCsv.promotion = temp[6] + "-" + temp[7];
            schedulesFromCsv.push(scheduleFromCsv);
        })
        //Le fichier a fini d'être parsé, on va parcourir le tableau de schedules
        .on('end', function (count) {
            var countLines = 0;
            /*
             On va exécuter une boucle de fonction asynchrones en série les une aprés les autres, chaque fonction s'éxecute une fois
             que la fonction précédente a finie ce qu'elle devait faire, l'appel à la fonction suivante se fait avec
             l'appel de "callback(null)
             */
            async.eachSeries(schedulesFromCsv, function (scheduleFromCsv, callback) {
                var classroom = scheduleFromCsv.classroom;
                var course = scheduleFromCsv.course;
                var teachers = scheduleFromCsv.teachers;
                var promotion = scheduleFromCsv.promotion;
                countLines++;
                var classroomId, courseId, promotionId;

                var teachersTab = teachers.split("|");
                var teachersIds = Array();

                /*
                On éxecute un ensemble de fonctions asynchrones en série
                Exécute la fonction findOneAndUpdate qui permet de chercher un élément dans la DB et de l'ajouter
                si il n'est pas présent
                 */
                async.series([
                    function (callback) {
                        if (teachersTab[0] != "") {
                            if (teachersTab.length == 2) {
                                var teachersTabClone = teachersTab.slice(0);
                                var teacherLastAndFirstName = teachersTabClone[0].split(" ");
                                async.series([
                                    function (callback) {
                                        Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                            {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                            {upsert: true}, function (err, object) {
                                                teachersIds.push(object._id);
                                                callback(null);
                                            });
                                    },
                                    function (callback) {
                                        teacherLastAndFirstName = teachersTabClone[1].split(" ");
                                        Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                            {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                            {upsert: true}, function (err, object) {
                                                teachersIds.push(object._id);
                                                // console.warn(teachersIds + " second " );
                                                // console.warn(teachersTab);
                                                callback(null);
                                            });
                                    }]);
                                callback(null);
                            }
                            else {
                                var teacherLastAndFirstName = teachersTab[0].split(" ");
                                Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                    {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                    {upsert: true}, function (err, object) {
                                        teachersIds.push(object._id);
                                        callback(null);
                                    });
                            }

                        }
                        else {
                            callback(null);
                        }
                    },
                    function (callback) {
                        Classroom.findOneAndUpdate({name: classroom}, {name: classroom}, {upsert: true}, function (err, object) {
                            classroomId = object._id;
                            callback(null);

                        });
                    },
                    function (callback) {
                        Course.findOneAndUpdate({name: course}, {name: course}, {upsert: true}, function (err, object) {
                            courseId = object._id;
                            callback(null);
                        });
                    },
                    function (callback) {
                        Promotion.findOneAndUpdate({name: promotion}, {name: promotion}, {upsert: true}, function (err, object) {
                            promotionId = object._id;
                            callback(null);
                        });
                    },
                    /*
                    Les éléments de la ligne ont été ajouté dans la DB si pas présents, on va tenter d'insérer la ligne
                    dans la DB maintenant
                     */
                    function (callback) {
                        //Objet que je vais envoyer à mes diverses fonctions de vérification de conflit
                        var req = {
                            params: {
                                id_classroom: classroomId,
                                id_course: courseId,
                                teachers: teachersIds,
                                id_promotion: promotionId,
                                day: scheduleFromCsv.day,
                                month: scheduleFromCsv.month - 1,
                                year: scheduleFromCsv.year,
                                begin: scheduleFromCsv.begin,
                                end: scheduleFromCsv.end
                            }
                        };
                        //Vérification si le groupe est déjà pris à ce moment-là
                        schedules.isPromotionTakenCSV(req, function (data) {
                            //Le groupe n'est pas disponible, on génère un conflit et on annule l'insertion de la ligne
                            if (data) {
                                if (teachersTab.length > 0 && teachersTab[0] != "") {
                                    conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                        + "; Professeurs : " + teachersTab
                                        + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                        + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Le groupe " + promotion + " est déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                        + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                }
                                else {
                                    conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                        + "; Professeur : Autonomie"
                                        + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                        + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Le groupe " + promotion + " est déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                        + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                }
                                callback(null);
                            }
                            //Le groupe est disponible, on vérifie maintenant si le local est disponible
                            else {
                                schedules.isClassroomTakenCSV(req, function (data) {
                                    //Le local n'est pas disponible, on génère un conflit et on annule l'insertion de la ligne
                                    if (data) {
                                        if (teachersTab.length > 0 && teachersTab[0] != "") {
                                            conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                                + "; Professeurs : " + teachersTab
                                                + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                                + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Le local " + classroom + " est déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                                + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                        }
                                        else {
                                            conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                                + "; Professeur : Autonomie"
                                                + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                                + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Le local " + classroom + " est déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                                + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                        }
                                        callback(null);
                                    }
                                    //Le local est disponible, on vérifie maintenant si le ou les professeur(s) sont disponible(s)
                                    else {
                                        schedules.isTeacherTakenCSV(req, function (data) {
                                            //Le ou les professeur(s) n'est/ne sont pas pas disponible(s), on génère un conflit et on annule l'insertion de la ligne
                                            if (data) {
                                                if (teachersTab.length === 2 && teachersTab[0] != "") {
                                                    conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                                        + "; Professeurs : " + teachersTab
                                                        + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                                        + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Les professeurs " + teachersTab + " sont déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                                        + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                                }
                                                else if (teachersTab.length === 1 && teachersTab[0] != "") {
                                                    conflicts.push({error: "Impossible d'insérer la ligne " + countLines + " [Cours : " + course + "; Local : " + classroom
                                                        + "; Professeur : " + teachersTab
                                                        + "; Groupe : " + promotion + "; Date : " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year
                                                        + "; Début : " + begins[scheduleFromCsv.begin - 1] + "; Fin : " + ends[scheduleFromCsv.end - 1] + "]", cause: "Cause : Le professeur " + teachersTab + " est déjà pris entre " + begins[scheduleFromCsv.begin - 1] + " et " + ends[scheduleFromCsv.end - 1]
                                                        + " le " + scheduleFromCsv.day + "/" + scheduleFromCsv.month + "/" + scheduleFromCsv.year});
                                                }

                                                callback(null);
                                            }
                                            //Le professeur est disponible, il n'y a donc pas de conflit, on va insérer dans la DB
                                            else {
                                                if (teachersIds.length === 0)teachersIds = null;
                                                //Création d'un objet de type horaire
                                                var temp = new Schedule({
                                                    teachers: teachersIds,
                                                    classroom: classroomId,
                                                    course: courseId,
                                                    promotion: promotionId,
                                                    color: stringToColour(course),
                                                    date: new Date(scheduleFromCsv.year, scheduleFromCsv.month - 1, scheduleFromCsv.day),
                                                    begin: scheduleFromCsv.begin,
                                                    end: scheduleFromCsv.end
                                                });
                                                temp.save();
                                                callback(null);
                                            }
                                        });

                                    }


                                });
                            }
                        });


                    }
                ], function () {
                    //Callback final, on passe au prochain tour
                    callback(null);
                });

            }, function () {
                //on renvoie l'ensemble des conflits
                res.json(conflicts);
            });
        })
        .on('error', function (error) {
            console.log(error.message);
        });

};