App.view.Add_first_element = Backbone.View.extend({
  el: '<div class="row">' +
    '<div class="col-md-12">' +
    '<button type="button" class="btn btn-primary btn-sm btn-block">' +
    '<span class="glyphicon glyphicon-plus-sign"></span> ' +
    '最初の要素を追加する' +
    '</button>' +
    '</div>' +
    '</div>',
  events: {
    'click button': 'button_clicked_'
  },
  button_clicked_: function (event) {
    this.trigger('add_first_element');
    event.preventDefault();
    return false;
  },
  hide: function () {
    this.$el.hide();
    return this;
  },
  show: function () {
    this.$el.show();
    return this;
  }
});