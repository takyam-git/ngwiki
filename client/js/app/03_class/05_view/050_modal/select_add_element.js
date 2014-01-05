App.view.modal.Select_add_element = App.view.modal.Element_base.extend({
  events: _.extend({
    'click .modal-body button': 'button_clicked_'
  }, App.view.modal.Base.prototype.events),

  /**
   * 描画する
   * @returns {App.view.modal.Select_add_element}
   */
  render: function () {
    var $buttons = $(App.template.action_bar.modal.add_element());
    App.view.modal.Base.prototype.render.call(this);
    this.set_title(__('どの要素を追加しますか？'))
      .set_body($buttons)
      .hide_footer();
    return this;
  },
  /**
   * ボタンクリック時にイベントをfire
   * @param {object} event
   * @returns {boolean}
   * @private
   */
  button_clicked_: function (event) {
    var $button = App.utility.dom.get_target(event, 'button');
    if ($button) {
      this.trigger('element_selected', $button.attr('data-type'), this.get_current_view());
    }
    event.preventDefault();
    this.hide();
    return false;
  }
});