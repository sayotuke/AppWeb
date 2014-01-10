/*
 Schéma d'un groupe
 */
var mongoose = require('mongoose');
PromotionSchema = new mongoose.Schema({
    name: String
})
Promotion = mongoose.model('Promotion', CourseSchema);
module.exports = Promotion;