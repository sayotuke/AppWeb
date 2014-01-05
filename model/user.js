var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
});

var User = mongoose.model('User', UserSchema);