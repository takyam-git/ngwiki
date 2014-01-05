App.view.modal.Element_base = App.view.modal.Base.extend({
  events: _.extend({
    'click .modal-body button': 'button_clicked_'
  }, App.view.modal.Base.prototype.events),

  /** @private {App.view.element.Base|null} */
  current_element_view_: null,
  /**
   * ボタンが押された要素のViewをセットする
   * @param element_view
   * @returns {App.view.modal.Select_add_element}
   */
  set_current_view: function (element_view) {
    if (element_view && (element_view instanceof App.view.element.Base)) {
      this.current_element_view_ = element_view;
    } else {
      this.current_element_view_ = null;
    }
    return this;
  },
  /**
   * 対象の要素のViewを返す
   * @returns {null|App.view.element.Base}
   */
  get_current_view: function () {
    return this.current_element_view_;
  }
});