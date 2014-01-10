/*
 Schéma d'un professeur
 */
var mongoose = require('mongoose');
teacherSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String
})
Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;