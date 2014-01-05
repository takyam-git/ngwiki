/**
 * 編集系のアクションを行うボタン群のView
 * @type {function}
 */
App.view.Action_bar = Backbone.View.extend({
  el: '<div class="row mt5 js-action-bar"></div>',
  events: {
    'click button': 'button_clicked_'
  },
  /** @private {App.view.element.Base} */
  element_view_: null,

  /** @private {jQuery} */
  $edit_button_: null,

  /** @private {jQuery} */
  $save_button_: null,

  /**
   * 共通初期化処理
   */
  initialize: function () {
  },
  /**
   * HTMLをセット
   * @returns {App.view.Action_bar}
   */
  render: function () {
    this.$el.html(App.template.action_bar.buttons());
    this.$edit_button_ = this.$el.find('[data-type="edit"]');
    this.$save_button_ = this.$el.find('[data-type="save"]');
    return this;
  },
  /**
   * アクションバーを表示する
   * @returns {App.view.Action_bar}
   */
  show: function () {
//    if (this.has_element_view() && this.get_element_view().is_editing()) {
//      this.change_to_save();
//    } else {
//      this.change_to_edit();
//    }
    this.$el.show();
    return this;
  },
  /**
   * アクションバーを隠す
   * @returns {App.view.Action_bar}
   */
  hide: function () {
    this.$el.hide();
    return this;
  },
  /**
   * アクションバーを適当な場所（bodyの末尾）に移動させる
   * @returns {App.view.Action_bar}
   */
  evacuate: function () {
    this.$el.appendTo(App.el.$body);
    return this;
  },
  /**
   * アクションバーを対象の要素のViewに配置させる
   * @param element_view
   * @returns {App.view.Action_bar}
   */
  move_to_element: function (element_view) {
    this.$el.appendTo(element_view.$el);
    return this;
  },
  /**
   * ボタンが押されたイベントをFireする
   * @param {object} event
   * @returns {boolean}
   * @private
   */
  button_clicked_: function (event) {
    this.trigger('action', App.utility.dom.get_target(event, 'button').attr('data-type'));
    return false;
  },
  set_editing: function () {
    this.$edit_button_.hide();
    this.$save_button_.show();
    return this;
  },
  unset_editing: function () {
    this.$edit_button_.show();
    this.$save_button_.hide();
  }
});