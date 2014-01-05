var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , history_schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    time: Date,
    data: Schema.Types.Mixed
  });
history_schema.pre('save', function (next) {
  this.time = new Date();
  next();
});
module.exports = mongoose.model('History', history_schema);