Backbone.sync_ = Backbone.sync;
Backbone.sync = function (method, model, options) {
  options = _.isObject(options) ? options : {};
  console.log(model, options.url);
  var url = typeof options.url !== 'undefined' && options.url !== null ? _.result(options, 'url') : _.result(model, 'url')
    , data = model instanceof Backbone.Model ? model.attributes : {}
    , param = {method: method.toLowerCase(), path: url};

  console.log(url, _.result(model, 'url'));

  param.data = options.data !== null ? _.extend(data, options.data) : data;

  if (model instanceof Backbone.Model) {
    param.type = 'model';
  } else if (model instanceof Backbone.Collection) {
    param.type = 'collection';
  } else {
    param.type = 'unknown';
  }

  App.io.emit('sync', param, function (err, response) {
    console.log('err', err, 'resp', response);
    if (typeof(err) !== 'undefined' && err !== null) {
      if (_.isFunction(options.error)) {
        options.error(err, response);
      }
    } else {
      if (_.isFunction(options.success)) {
        options.success(response);
      }
    }

    if (_.isFunction(options.complete)) {
      options.complete(err, model, response);
    }
  });

  // Make the request, allowing the user to override any Ajax options.
  model.trigger('request', model, param, options);
  return true;
};