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
Attention pour l'instant la couleur n'est pas précisée dans le csv, on met une couleur par défaut pour l'instant
 */

exports.import = function(req, res)
{
    //console.log(req.files.myFile.path);
    //CSV File Path or CSV String or Readable Stream Object
    var csvFileName = req.files.myFile.path;
    //console.log(req.files.myFile.path);
    var schedulesFromCsv = Array();
    var conflicts = Array();
    var begins = Array("8:45","9:45","11:00","12:00","13:45","14:45","16:00","17:00");
    var ends = Array("9:45","10:45","12:00","13:00","14:45","15:45","17:00","18:00");
    csv()
        .from.stream(fs.createReadStream(csvFileName))
        .transform( function(row){
            row.unshift(row.pop());
            return row;
        })
        .on('record', function(row,index){
            var scheduleFromCsv = {};
            //   console.log('#'+index+' '+JSON.stringify(row));
            var temp = JSON.stringify(row).split(";");
            //console.log(temp);
            temp[0] = temp[0].substr(2);
            scheduleFromCsv.day = temp[0].substr(-2);
            scheduleFromCsv.month = temp[0].substr(5,2);
            scheduleFromCsv.year = temp[0].substr(0,4);
            //  console.log("day : "+day);
            //  console.log("month : "+month);
            //  console.log("year : "+year);
            temp[temp.length-1] = temp[temp.length-1].substr(0, temp[temp.length-1].length-2);
            scheduleFromCsv.begin = temp[1];
            scheduleFromCsv.end = temp[2];
            scheduleFromCsv.classroom = temp[3];
            scheduleFromCsv.teachers = temp[4];
            scheduleFromCsv.course = temp[5];
            scheduleFromCsv.promotion = temp[6]+"-"+temp[7];
            schedulesFromCsv.push(scheduleFromCsv);
            var classroomChecked = false;
           // console.log("avant check");

            //classrooms.findByName(classroom);
            /*while(!classroomChecked)
             {
             console.log("go go ");

             console.log(result);
             if(result!==-1 && result!==undefined)classroomChecked=true;
             }*/
            /*  for(var index in temp)
             {
             console.log(temp[index]);
             }    */

            /*  var tab = (temp+"").split(";");
             for(var index in tab)
             {
             console.log(tab[index]);
             }   */
        })
        .on('end', function(count){
            //return false;
          //  console.log('Number of lines: '+count);
          //  console.log(schedulesFromCsv[3]);
            countTest = 0;
            tab = Array();
            var countLines = 0;
           async.eachSeries(schedulesFromCsv,function(scheduleFromCsv, callback)
            {
                //setTimeout(function(){console.log("");},3000);
                var classroom = scheduleFromCsv.classroom;
                var course = scheduleFromCsv.course;
                var teachers = scheduleFromCsv.teachers;
                var promotion = scheduleFromCsv.promotion;
                countLines++;
                var classroomId, courseId, promotionId;

                var teachersTab = teachers.split("|");
                //console.warn(teachersTab);
                var teachersIds = Array();
                //var teachersIDsClone = teachersTab.slice(0);
                //teachersIds.length=0;
               /* for (var j in teachersTab) {
                    if (teachersTab[j] !== "") {
                        var teacherLastAndFirstName = teachersTab[j].split(" ");
                        Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                            {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                            {upsert: true}, function (err, object) {
                                teachersIds.push(object._id);
                               // console.warn(teachersIds + "at index : " + index);
                                //console.warn(teachersTab);
                            });
                    }
                }*/
                async.series([
                    function(callback){ if (teachersTab[0]!="") {

                       // console.warn("LENGHT : "+teachersTab.length);
                        //var teachersIDsClone = teachersTab.slice(0);
                        if(teachersTab.length==2)
                        {
                            var teachersTabClone = teachersTab.slice(0);
                            var teacherLastAndFirstName = teachersTabClone[0].split(" ");
                            async.series([
                            function(callback){
                                Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                    {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                    {upsert: true}, function (err, object) {
                                        teachersIds.push(object._id);
                                       // console.warn(teachersIds + " first " );
                                       // console.warn(teachersTab);
                                        callback(null);
                                    });
                            },
                            function(callback){
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

                            //On Clone le tableau sinon le temps que la requete asynchrone se fasse, il aura été changé par le foreach


                                    //console.warn(teachersIds + "at index : " + index);
                                    //console.warn(teachersTabClone);
                        }
                        else
                        {
                            var teacherLastAndFirstName = teachersTab[0].split(" ");
                            Teacher.findOneAndUpdate({first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                {first_name: teacherLastAndFirstName[0], last_name: teacherLastAndFirstName[1]},
                                {upsert: true}, function (err, object) {
                                    teachersIds.push(object._id);
                                   // console.warn(teachersIds + " at index : ");
                                   // console.warn(teachersTab);
                                    callback(null);
                                });
                        }

                    }
                    else
                    {
                        callback(null);
                    }},
                    function(callback){ Classroom.findOneAndUpdate({name:classroom}, {name:classroom}, {upsert:true}, function (err, object) {
                        classroomId = object._id;
                        //console.warn("sdcvgdfgfghfdh")
                        callback(null);

                    }); },
                    function(callback){ Course.findOneAndUpdate({name:course}, {name:course}, {upsert:true}, function (err, object) {
                        courseId = object._id;
                        //console.warn("classroom: "+classroomId);
                        //console.warn("course fgvfgdfgee : "+courseId);
                        //countTest++;
                        //setTimeout(function(){callback(null);},3000);
                        callback(null);
                        //if(countTest>=schedulesFromCsv.length)console.warn("fini"+countTest);
                    }); },
                    function(callback){ Promotion.findOneAndUpdate({name:promotion}, {name:promotion}, {upsert:true}, function (err, object) {
                        promotionId = object._id;
                        callback(null);
                    }); },
                    function(callback){
                        var req = {
                            params:{
                                id_classroom: classroomId,
                                id_course: courseId,
                                teachers: teachersIds,
                                id_promotion: promotionId,
                                day: scheduleFromCsv.day,
                                month: scheduleFromCsv.month-1,
                                year: scheduleFromCsv.year,
                                begin: scheduleFromCsv.begin,
                                end: scheduleFromCsv.end
                            }
                        };
                        //callback(null);
                       // console.warn(req);
                        //setTimeout(function(){console.log("");},3000);
                        schedules.isPromotionTakenCSV(req, function(data)
                        {
                            if(data)
                            {
                                if(teachersTab.length>0 && teachersTab[0]!= "")
                                {
                                    conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                        +"; Professeurs : "+teachersTab
                                        +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                        +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                        "Cause : Le groupe "+promotion+" est déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                        +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                }
                                else
                                {
                                    conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                        +"; Professeur : Autonomie"
                                        +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                        +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                        "Cause : Le groupe "+promotion+" est déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                        +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                }
                                callback(null);
                            }
                            else
                            {
                                schedules.isClassroomTakenCSV(req, function (data) {
                                    //console.warn(data);
                                    if (data) {
                                        if(teachersTab.length>0 && teachersTab[0]!= "")
                                        {
                                            conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                                +"; Professeurs : "+teachersTab
                                                +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                                +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                                "Cause : Le local "+classroom+" est déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                                +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                        }
                                        else
                                        {
                                            conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                                +"; Professeur : Autonomie"
                                                +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                                +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                                "Cause : Le local "+classroom+" est déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                                +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                        }
                                        callback(null);
                                    }
                                    else {
                                        //callback(null);
                                        schedules.isTeacherTakenCSV(req, function(data){
                                            //console.warn(data);
                                            if (data) {
                                                if(teachersTab.length===2 && teachersTab[0]!= "")
                                                {
                                                    conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                                        +"; Professeurs : "+teachersTab
                                                        +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                                        +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                                        "Cause : Les professeurs "+teachersTab+" sont déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                                        +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                                }
                                                else if(teachersTab.length ===1 && teachersTab[0]!= "")
                                                {
                                                    conflicts.push({error: "Impossible d'insérer la ligne "+countLines+" [Cours : "+course+"; Local : "+classroom
                                                        +"; Professeur : "+teachersTab
                                                        +"; Groupe : "+promotion+"; Date : "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year
                                                        +"; Début : "+begins[scheduleFromCsv.begin-1]+"; Fin : "+ends[scheduleFromCsv.end-1]+"]",cause:
                                                        "Cause : Le professeur "+teachersTab+" est déjà pris entre "+begins[scheduleFromCsv.begin-1]+" et "+ends[scheduleFromCsv.end-1]
                                                        +" le "+scheduleFromCsv.day+"/"+scheduleFromCsv.month+"/"+scheduleFromCsv.year});
                                                }

                                                callback(null);
                                            }
                                            else {
                                                console.warn("prof libre");
                                                if (teachersIds.length === 0)teachersIds = null;
                                                var temp = new Schedule({
                                                    teachers: teachersIds,
                                                    classroom: classroomId,
                                                    course: courseId,
                                                    promotion: promotionId,
                                                    color: "#19c749",
                                                    date: new Date(scheduleFromCsv.year, scheduleFromCsv.month-1, scheduleFromCsv.day),
                                                    begin: scheduleFromCsv.begin,
                                                    end: scheduleFromCsv.end
                                                });
                                                temp.save(/*function(err, data){console.warn("j'ai fait "+data);}*/);
                                                callback(null);
                                                //setTimeout(function(){console.log("");},3000);
                                                //callback(null);
                                            }
                                        });

                                    }



                                });
                            }
                        });


                    }
                   /* function(callback){
                        //setTimeout(function(){callback(null)},10000);
                        console.warn("tour fini");
                        callback(null);
                    },
                    function(callback){
                        console.warn("tour vraiment fini");
                        callback(null);
                    }*/
                ],function(){;callback(null);});
                //callback(null);


                //console.warn("voici name : "+name+" at index : "+index);
                //On cherche si un cours existe avec ce nom, si non, on l'insère

                //console.warn("voici course :"+data2.name+" at index : "+index+" et count : "+countTest);


                //callback();

            }, function(){console.warn(conflicts);
               res.json(conflicts);});
           /* Classroom.find({name: "AHAH"}).limit(1).exec(function(err, result) {
                if (!err) {
                    console.warn("voici result : "+result);
                    if(result!==null)
                    {
                        console.warn("classroom déjà là");
                    }
                    else
                    {
                        console.warn("je vais save");
                    }
                } else {
                    console.log("erreur lors du find : "+err);
                };
            }); */
               /*Classroom.update({name: name}, {$set: {name: name}}, {upsert:true},function(err,data,n){
                    console.warn(countTest);
                    console.warn(n);
                    countTest++;
                    if(countTest>=schedulesFromCsv.length)console.warn("fini");
                });*/
               /* Classroom.findAndModify({name:name}, [], { new: true, name:name }, {}, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                });*/
                /*Classroom.findOne({name: name}).exec(function(err, result) {
                    console.log(countA);
                    countA++;
                    if (!err) {
                        console.log("voici result : "+result);
                        if(result!==null)
                        {
                            console.log("classroom déjà là");
                            //countA++;
                        }
                        else
                        {
                            console.log("je vais save");
                            tab.push(name);
                            //temp = new Classroom({name: name});
                            //temp.save();
                           // countA++;
                        }
                    } else {
                        console.log("erreur lors du find : "+err);
                    };
                });*/

          /*  console.log(tab);
            var index = 0;
            while(index<schedulesFromCsv.length)
            {
                var name = schedulesFromCsv[index].classroom;
                Classroom.update({name: name}, {$set: {name: name}}, {upsert:true},function(err,data){index++; if(index>1)console.log("a");});
            }                 */
            //console.log("fini");
        })
        .on('error', function(error){
            console.log(error.message);
        });

}