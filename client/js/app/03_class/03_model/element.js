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
    history: [],
    data: {}
  },
  initialize: function () {
    this.listenTo(this, 'change:history', this.history_changed_);
    this.history_changed_();
  },
  get_data: function (key) {
    return this.get('data')[key];
  },
  set_data: function (key, value) {
    var data = this.get('data');
    data[key] = value;
    this.set('data', data);
    return this;
  },
  history_changed_: function () {
    var last_history = _.last(this.get('history'));
    if (last_history) {
      this.set('last_update_user', last_history.user);
      this.set('last_update_time', last_history.time);
      this.set('data', last_history.data);
    }
  }
});