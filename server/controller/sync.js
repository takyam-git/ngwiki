var mongoose = require('mongoose')
  , _ = require('underscore')
  , inflection = require('inflection');
module.exports = function (method, type, path, data, ack) {
  if (!path) {
    ack('path is empty.');
    return;
  }
  switch (type) {
    case 'model':
    case 'collection':
      var args = path.split('/')
        , name = args.shift();
      if (name) {
        var model_name = inflection.camelize(inflection.singularize(name))
          , model = mongoose.model(model_name)
          , sync_method = type + '_' + method;
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
  }
};