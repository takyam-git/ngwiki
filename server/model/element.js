var co = require('co')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , element_schema = new Schema({
    type: {type: String, 'enum': ['paragraph']},
    is_locked: {type: Boolean, 'default': false},
    is_deleted: {type: Boolean, 'default': false},
    history: [
      {type: Schema.Types.ObjectId, ref: 'History'}
    ]
  });

element_schema.method('format_response', function () {
  var element_data = this.toObject()
    , last_history = _.last(this.history);
  delete(element_data['history']);
  element_data.data = last_history.data;
  element_data.last_update_user = last_history.user;
  element_data.last_update_time = last_history.time;
  return element_data;
});

element_schema.static('model_create', function (params, data, ack) {
  var Model_History = mongoose.model('History')
    , Model_Element = mongoose.model('Element')
    , history = new Model_History({data: data.data});
  history.save(function () {
    var element = new Model_Element();
    element.type = data.type;
    element.history.push(history);
    element.save(function (err, document) {
      document.populate('history', function () {
        ack(err, document.format_response());
      });
    });
  });
});

element_schema.static('model_update', function (params, data, ack) {
  if (!params[0]) {
    ack('IDが無いぽよ');
    return;
  }
  var id = params[0];
  Element_Model.findById(id).populate('history').exec(function (err, element) {
    if (err !== null) {
      ack(err);
      return;
    }
    if (element === null) {
      ack('そんなIDのやつないぽよ');
      return;
    }
    var Model_History = mongoose.model('History');
    var history = new Model_History({data: data.data});
    history.save(function () {
      element.history.push(history);
      element.save(function (err, element) {
        ack(err, element.format_response());
      });
    });
  });
});

element_schema.static('collection_read', function (args, data, ack) {
  var Model_Element = mongoose.model('Element');
  Model_Element.find().slice('history', -1).populate('history').exec(function (err, elements) {
    if (err === null && _.isArray(elements)) {
      elements = _.map(elements, function (element) {
        return element.format_response();
      });
    }
    ack(err, elements);
  })
});

var Element_Model = mongoose.model('Element', element_schema);

module.exports = Element_Model;