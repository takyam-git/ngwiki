$(function () {
  App.el.$window = $(window);
  App.el.$document = $(document);
  App.el.$body = $('body');
  App.el.$side_bar = $('#sidebar');
  App.el.$main = $('#main');

  App.el.$document.on('click', function (event) {
    Backbone.Events.trigger('document_clicked', event);
    return true;
  });
});