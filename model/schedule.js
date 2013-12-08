var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ScheduleSchema = new Schema({
    teachers: [Schema.Types.ObjectId],
    classroom: Schema.Types.ObjectId,
    course: Schema.Types.ObjectId,
    promotion: Schema.Types.ObjectId,
    date: {type: Date, default: Date.now},
    begin: Number,
    end: Number
})
Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;