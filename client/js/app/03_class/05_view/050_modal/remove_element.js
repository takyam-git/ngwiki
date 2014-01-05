App.view.modal.Remove_element = App.view.modal.Element_base.extend({
  /**
   * 描画する
   * @returns {App.view.modal.select_add_element}
   */
  render: function () {
    App.view.modal.Base.prototype.render.call(this);
    this
      .reset()
      .set_title(__('この要素を削除してもいいですか？'))
      .set_body('<p>' + __('一度削除した要素は復活できません。') + '</p>')
      .set_decide_label(__('削除'));
    return this;
  }
});