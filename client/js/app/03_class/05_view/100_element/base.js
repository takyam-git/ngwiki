App.view.element.Base = Backbone.View.extend({
  el: [
    '<div class="js-element">',
    ' <div class="row">',
    '   <div class="col-md-10 js-element-container"></div>',
    '   <div class="col-md-2 js-element-reaction">',
    '     <div class="btn-group btn-group-xs">',
    '       <button type="button" class="btn btn-default" data-id="comment">',
    '         <span class="glyphicon glyphicon-comment" style="color: #808080;"></span> 99+',
    '       </button>',
    '       <button type="button" class="btn btn-default" data-id="good">',
    '         <span class="glyphicon glyphicon-heart-empty" style="color: #EE5757"></span> 99+',
    '       </button>',
    '     </div>',
    '   </div>',
    '</div>'
  ].join(''),
  model: null,
  $container: null,
  template: _.template(''),
  events: {
    'mouseenter': 'mouse_enter',
    'mouseleave': 'mouse_leave'
  },
  is_editing_: false,
  is_locked_: false,
  data: {},
  initialize: function () {
    this.data = this.model.get('data');
    this.$container = this.$el.find('.js-element-container');
    this.listenTo(Backbone.Events, 'document_clicked', this.check_other_clicked);
    this.listenTo(this, 'added', this.added);
    this.listenTo(this.model, 'destroy', this.model_destroyed_);
  },
  render: function () {
    return this;
  },
  /**
   * 要素にカーソルがホバーインした時にイベントをfireする
   * @returns {boolean}
   */
  mouse_enter: function () {
    this.trigger('mouse_entered', this);
    return true;
  },
  /**
   * 要素からカーソルがホバーアウトした時にイベントをfireする
   * @returns {boolean}
   */
  mouse_leave: function () {
    this.trigger('mouse_leaved', this);
    return true;
  },
  editable: function () {
    this.$container.addClass('editable');
    return this;
  },
  dis_editable: function () {
    this.$container.removeClass('editable');
    return this;
  },
  check_other_clicked: function (event) {
    if (_.isFunction(this.other_clicked) && event.target
      && this.$el.find(event.target).length === 0
      && this.$el.filter(event.target).length === 0) {
      this.other_clicked();
    }
  },
  other_clicked: null,
  added: function () {
  },
  /**
   * 編集状態にする
   */
  edit: function () {
    this.set_editing_(true);
  },
  /**
   * 保存処理を行う
   */
  save: function () {
    this.set_editing_(false);
  },
  /**
   * 編集中かどうかを返す
   * @returns {boolean}
   */
  is_editing: function () {
    return !!this.is_editing_;
  },
  /**
   * 編集中かどうかの状態をセットする
   * @param {boolean} is_editing
   * @private
   */
  set_editing_: function (is_editing) {
    this.is_editing_ = !!is_editing;
  },
  /**
   * ロック中かどうかを返す
   * @returns {boolean}
   */
  is_locked: function () {
    return !!this.is_locked_;
  },
  /**
   * ロック中かどうかの状態をセットする
   * @param {boolean} is_locked
   * @private
   */
  set_locked_: function (is_locked) {
    this.is_locked_ = !!is_locked;
  },
  /**
   * モデルごと自身を削除する
   * @returns {App.view.element.base}
   */
  destroy: function () {
    this.model.destroy();
    return this;
  },
  /**
   * モデル削除時に自身を削除する
   * @returns {App.view.element.base}
   * @private
   */
  model_destroyed_: function () {
    this.remove();
    return this;
  }
});