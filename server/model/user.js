var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , user_schema = new Schema({
    name: String
  });

module.exports = mongoose.model('User', user_schema);