App.view.modal.Base = Backbone.View.extend({
  el: '<div class="modal fade" role="dialog"></div>',
  events: {
    'click .modal-footer-decide': 'decided_',
    'click .modal-footer-cancel': 'canceled_'
  },
  /** @private {jQuery} */
  $title_: null,
  /** @private {jQuery} */
  $body_: null,
  /** @private {jQuery} */
  $footer_: null,
  /** @private {jQuery} */
  $cancel_: null,
  /** @private {jQuery} */
  $decide_: null,

  /**
   * テンプレートからDOMを生成し、jQueryのDOMを取得しておく
   * 生成時は非表示状態で作成している
   * @returns {App.view.modal.Base}
   */
  render: function () {
    this.$el.html(App.template.modal());
    this.$title_ = this.$el.find('.modal-title');
    this.$body_ = this.$el.find('.modal-body');
    this.$footer_ = this.$el.find('.modal-footer');
    this.$cancel_ = this.$footer_.find('.modal-footer-cancel');
    this.$decide_ = this.$footer_.find('.modal-footer-decide');
    this.$el.modal({show: false});
    return this;
  },
  /**
   * モーダルを表示する
   * @returns {App.view.modal.Base}
   */
  show: function () {
    this.$el.modal('show');
    return this;
  },
  /**
   * モーダルを非表示にする
   * @returns {App.view.modal.Base}
   */
  hide: function () {
    this.$el.modal('hide');
    return this;
  },
  /**
   * 初期状態に戻す
   * @returns {App.view.modal.Base}
   */
  reset: function () {
    this.set_title('')
      .set_body('')
      .set_cancel_label(__('キャンセル'))
      .set_decide_label(__('実行'))
      .show_cancel()
      .show_decide()
      .show_footer();
    return this;
  },
  /**
   * キャンセルボタンのラベル文字列をセットする
   * @param {string} label
   * @returns {App.view.modal.Base}
   */
  set_cancel_label: function (label) {
    this.$cancel_.text(label);
    return this;
  },
  /**
   * 決定ボタンのラベル文字列をセットする
   * @param {string} label
   * @returns {App.view.modal.Base}
   */
  set_decide_label: function (label) {
    this.$decide_.text(label);
    return this;
  },
  /**
   * キャンセルボタンを非表示にする
   * @returns {App.view.modal.Base}
   */
  hide_cancel: function () {
    this.$cancel_.hide();
    return this;
  },
  /**
   * キャンセルボタンを表示する
   * @returns {App.view.modal.Base}
   */
  show_cancel: function () {
    this.$cancel_.show();
    return this;
  },
  /**
   * 決定ボタンを非表示にする
   * @returns {App.view.modal.Base}
   */
  hide_decide: function () {
    this.$decide_.hide();
    return this;
  },
  /**
   * 決定ボタンを表示する
   * @returns {App.view.modal.Base}
   */
  show_decide: function () {
    this.$decide_.show();
    return this;
  },
  /**
   * フッターを非表示にする
   * @returns {App.view.modal.Base}
   */
  hide_footer: function () {
    this.$footer_.hide();
    return this;
  },
  /**
   * フッターを表示する
   * @returns {App.view.modal.Base}
   */
  show_footer: function () {
    this.$footer_.show();
    return this;
  },
  /**
   * タイトル文字列をセットする
   * @param title
   * @returns {App.view.modal.Base}
   */
  set_title: function (title) {
    this.$title_.text(title);
    return this;
  },
  /**
   * ボディーの要素をセットする
   * 文字列が渡ってきたらHTMLだという前提でセットする
   * @param {jQuery|string} body
   * @returns {App.view.modal.Base}
   */
  set_body: function (body) {
    if (typeof body === 'string') {
      this.$body_.html(body);
    } else {
      this.$body_.empty().append(body);
    }
    return this;
  },
  /**
   * 決定ボタン押下時にイベントをfire
   * @param {object} event
   * @returns {boolean}
   * @private
   */
  decided_: function (event) {
    this.trigger('decide', this);
    event.preventDefault();
    return false;
  },
  /**
   * キャンセルボタン押下時にイベントをfire
   * @param {object} event
   * @returns {boolean}
   * @private
   */
  canceled_: function (event) {
    this.trigger('cancel', this);
    event.preventDefault();
    return false;
  }
});