var mongoose = require('mongoose');
CourseSchema = new mongoose.Schema({
    name: String
})
Course = mongoose.model('Course', CourseSchema);
module.exports = Course;