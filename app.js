
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var http = require('http');
var routes = require('./routes');
var classrooms = require('./controller/classrooms');
var teachers = require('./controller/teachers');
var courses = require('./controller/courses');
var promotions = require('./controller/promotions');
var schedules = require('./controller/schedules');
var csvHandler = require('./controller/csvHandler');
var user = require('./model/user');
var auth = require('./controller/users');
var csv = require('csv');
var fs = require('fs');
var async = require('async');
var passport = require('passport');
var crypto = require('crypto');

var app = express();


// database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/calendar');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'zohgzkenfz5r5ge6r54gz6' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use(app.router);




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
passport.use(user.localStrategy);
passport.serializeUser(user.serializeUser);
passport.deserializeUser(user.deserializeUser);

// Default session handling. Won't explain it as there are a lot of resources out there
app.use(express.session({
    secret: "aehj9f5d2bj5mm8tsw52g14",
    cookie: {maxAge: new Date(Date.now() + 3600000)}, // 1 heure
    maxAge: new Date(Date.now() + 3600000) // 1 heure
    //store: new RedisStore(config.database.redis) // You can not use Redis
}));




//authentication
app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/login/success', auth.loginSuccess);
app.get('/auth/login/failure', auth.loginFailure);
app.get('/getSession', auth.getSession);

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
app.get('/getSchedule/:_id', schedules.find);
app.put('/editSchedule/:id/:day/:month/:year/:begin/:end', schedules.edit);
app.delete('/deleteSchedule/:id', schedules.delete);
app.get('/getSchedules', schedules.findAll);
app.get('/getSlotsTaken/:day/:month/:year/:promotion', schedules.getSlotsTaken)
app.get('/getScheduleModels', schedules.getScheduleModels);
app.get('/getTeacherTotalHour/:id_teacher', schedules.getTeacherTotalHour);
app.get('/getTeacherTotalHourByCourse/:id_teacher/:id_course', schedules.getTeacherTotalHourByCourse);
app.get('/getPromotionTotalHourByCourse/:id_promotion/:id_course', schedules.getPromotionTotalHourByCourse);
app.get('/isClassroomTaken/:id_classroom/:id_course/:day/:month/:year/:begin/:end', schedules.isClassroomTaken);
app.get('/isTeacherTaken/:teachers/:id_course/:day/:month/:year/:begin/:end', schedules.isTeacherTaken);

//app.post('/login', users.login);

//TO-DO : gérer les fichiers non csv !!!!!!!!!
app.post('/uploadFile', csvHandler.import);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
