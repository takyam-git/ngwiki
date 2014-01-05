App.template.action_bar.modal.add_element = (function (element_list) {
  var rows = ''
    , buttons = ''
    , count = 0
    , button_template = _.template([
      '<div class="col-md-4">',
      ' <button type="button" class="btn btn-default btn-lg btn-block" data-type="<%- key %>">',
      '<span class="glyphicon glyphicon-plus-sign"></span> ',
      '<%- name %>',
      ' </button>',
      '</div>'
    ].join(''))
    , row_template = _.template([
      '<div class="row">',
      '<%= buttons %>',
      '</div>'
    ].join(''));

  _.each(element_list, function (element, key) {
    buttons += button_template({name: element.name, key: key});
    if (++count % 3 === 0) {
      rows += row_template({buttons: buttons});
      buttons = '';
    }
  });
  if (buttons.length > 0) {
    rows += row_template({buttons: buttons});
  }
  return _.template([
    '<div class="row">',
    ' <div class="col-md-12">',
    '   <p>追加する要素を選んでください</p>',
    rows,
    ' </div>',
    '</div>'
  ].join(''));
})(App.config.element);