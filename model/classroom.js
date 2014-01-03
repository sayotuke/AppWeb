var mongoose = require('mongoose');
classroomSchema = new mongoose.Schema({
    name: String
})

/*classroomSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};*/

Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;