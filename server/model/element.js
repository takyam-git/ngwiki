var co = require('co')
  , thunk = require('thunkify')
  , thunker = require('thunker')
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

element_schema.static('sync_create', function (params, data, ack) {
  var Model_History = mongoose.model('History')
    , Model_Element = mongoose.model('Element')
    , history = new Model_History({data: data.data});
  history.save(function () {
    var element = new Model_Element();
    element.type = data.type;
    element.history.push(history);
    element.save(function (err, document) {
      document.populate('history', function () {
        ack(err, document.toObject());
      });
    });
  });
});

element_schema.static('sync_update', function (params, data, ack) {
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
    try {
      var Model_History = mongoose.model('History');
      var history = new Model_History({data: data.data});
      history.save(function () {
        element.history.push(history);
        element.save(function (err, element) {
          ack(err, element.toObject());
        });
      });
    } catch (errrr) {
      console.log(errrr);
    }
  });
  console.log(params, data);
});

var Element_Model = mongoose.model('Element', element_schema);

module.exports = Element_Model;