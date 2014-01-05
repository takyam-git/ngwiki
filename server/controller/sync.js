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
      if (!name) {
        ack('Name is empty.');
        return;
      }

      var model_name = inflection.camelize(inflection.singularize(name))
        , model = mongoose.model(model_name)
        , sync_method = type + '_' + method;

      if (!model) {
        ack('Unknown model "' + model_name + '".');
        return;
      }

      if (!_.isFunction(model[sync_method])) {
        ack('model "' + model_name + '" has not method "' + sync_method + '".');
        return;
      }

      model[sync_method](args, data, ack);

      break;
    default:
      ack('Unknown type.');
      return;
  }
};