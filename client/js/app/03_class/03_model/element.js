/** @typedef {{cid:string}} */
App.model.Element = Backbone.Model.extend({
  idAttribute: '_id',
  urlRoot: 'element',
  defaults: {
    _id: null,
    type: null,
    is_locked: false,
    is_deleted: false,
    last_update_user: null,
    last_update_time: null,
    data: {}
  },
  initialize: function () {
    console.log(this);
  },
  get_data: function (key) {
    return this.get('data')[key];
  },
  set_data: function (key, value) {
    var data = this.get('data');
    data[key] = value;
    this.set('data', data);
    return this;
  }
});