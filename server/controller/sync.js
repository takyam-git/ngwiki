var mongoose = require('mongoose')
  , _ = require('underscore');
module.exports = function (method, type, path, data, ack) {
  if (type === 'model' && path) {
    var args = path.split('/')
      , name = args.shift();
    if (name) {
      var model_name = name.charAt(0).toUpperCase() + name.slice(1)
        , model = mongoose.model(model_name)
        , sync_method = 'sync_' + method;
      if (model) {
        if (typeof model[sync_method] === 'function') {
          model[sync_method](args, data, ack);
        } else {
          console.log('model "' + model_name + '" has not method "' + sync_method + '".');
          ack('model "' + model_name + '" has not method "' + sync_method + '".');
        }
      } else {
        console.log('Unknown model "' + model_name + '".');
        ack('Unknown model "' + model_name + '".');
      }
    } else {
      console.log('URL is empty.');
      ack('URL is empty.');
    }
  } else if (type === 'collection' && path) {
    if (path === 'elements') {
      var Model_Element = mongoose.model('Element');
      Model_Element.find({}).populate('history').exec(function (err, elements) {
        ack(null, _.map(elements, function (element) {
          return element.toObject()
        }));
      });
    }
  } else {
    console.log('Unknown type.');
    ack('Unknown type.');
  }
  console.log(method, type, path, data);
};