/*
Schéma d'un local
 */
var mongoose = require('mongoose');
classroomSchema = new mongoose.Schema({
    name: String
})


Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;