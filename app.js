
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes');
var classrooms = require('./controller/classrooms');
var teachers = require('./controller/teachers');
var courses = require("./controller/courses");
var promotions = require("./controller/promotions");
var schedules = require("./controller/schedules");
var csv = require('csv');
var fs = require('fs');

var app = express();

// database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/calendar');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//Classrooms
app.get('/getClassrooms', classrooms.findAll);
app.post('/addClassroom/', classrooms.add);
app.put('/editClassroom/:id/:name', classrooms.edit);
app.delete('/deleteClassroom/:id', classrooms.delete);

//Teachers
app.get('/getTeachers', teachers.findAll);
app.post('/addTeacher', teachers.add);
app.put('/editTeacher/:id/:last_name/:first_name', teachers.edit);
app.delete('/deleteTeacher/:id', teachers.delete);

//Courses
app.get('/getCourses', courses.findAll);
app.post('/addCourse/', courses.add);
app.put('/editCourse/:id/:name', courses.edit);
app.delete('/deleteCourse/:id', courses.delete);

//Promotions
app.get('/getPromotions', promotions.findAll);
app.post('/addPromotion/', promotions.add);
app.put('/editPromotion/:id/:name', promotions.edit);
app.delete('/deletePromotion/:id', promotions.delete);

//Schedules
app.post('/addSchedule', schedules.add);
app.get('/getSchedules', schedules.findAll);
app.get('/getSlotsTaken/:day/:month/:year/:promotion', schedules.getSlotsTaken)
app.get('/getScheduleModels', schedules.getScheduleModels);
app.get('/getTeacherTotalHour/:id_teacher', schedules.getTeacherTotalHour);
app.get('/getTeacherTotalHourByCourse/:id_teacher/:id_course', schedules.getTeacherTotalHourByCourse);
app.get('/getPromotionTotalHourByCourse/:id_promotion/:id_course', schedules.getPromotionTotalHourByCourse);
app.get('/isClassroomTaken/:id_classroom/:id_course/:day/:month/:year/:begin/:end', schedules.isClassroomTaken);
app.get('/isTeacherTaken/:teachers/:id_course/:day/:month/:year/:begin/:end', schedules.isTeacherTaken);


//TO-DO : gérer les fichiers non csv !!!!!!!!!
app.post('/uploadFile', function(req, res, next) {
    console.log(req.files.myFile.path);
    //CSV File Path or CSV String or Readable Stream Object
    var csvFileName = req.files.myFile.path;

    csv()
        .from.stream(fs.createReadStream(csvFileName))
        .transform( function(row){
            row.unshift(row.pop());
            return row;
        })
        .on('record', function(row,index){
            console.log('#'+index+' '+JSON.stringify(row));
            var temp = JSON.stringify(row).split(";");
            //console.log(temp);
            temp[0] = temp[0].substr(2);
            var day = temp[0].substr(-2);
            var month = temp[0].substr(5,2);
            var year = temp[0].substr(0,4);
            console.log("day : "+day);
            console.log("month : "+month);
            console.log("year : "+year);
            temp[temp.length-1] = temp[temp.length-1].substr(0, temp[temp.length-1].length-2);
            var begin = temp[1];
            var end = temp[2];
            var classroom = temp[3];
            var course = temp[4];
            var promotion = temp[5]+"-"+temp[6];

            var classroomChecked = false;
            console.log("avant check");
            var result = classrooms.findByName(classroom);
            while(!classroomChecked)
            {
                console.log("go go ");

                console.log(result);
                /*if(result!==-1 && result!==undefined)*/classroomChecked=true;
            }
          /*  for(var index in temp)
            {
                console.log(temp[index]);
            }    */

            /* var tab = (temp+"").split(";");
             for(var index in tab)
             {
                 console.log(tab[index]);
             }   */
        })
        .on('end', function(count){
            console.log('Number of lines: '+count);
        })
        .on('error', function(error){
            console.log(error.message);
        });
    res.json("ok");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
