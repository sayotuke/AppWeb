/*
 Schéma d'un horaire
 */
var mongoose = require('mongoose');
var promotion = require('../model/promotion');
var course = require('../model/course');
var classroom = require('../model/classroom');
var teacher = require('../model/teacher');
var Schema = mongoose.Schema;
ScheduleSchema = new Schema({
    teachers: [{type: Schema.Types.ObjectId, ref: 'Teacher'}],
    classroom: {type: Schema.Types.ObjectId, ref: 'Classroom'},
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    promotion: {type: Schema.Types.ObjectId, ref: 'Promotion'},
    color: String,
    date: {type: Date, default: new Date(0)},
    begin: Number,
    end: Number
})
Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;