App.view.page.standard = Backbone.View.extend({
  el: '#main',

  /** @property {App.collection.Elements} */
  collection: null,

  /** @private {Object} キーが要素モデルのcidで、値が要素Viewのオブジェクト */
  views_: {},

  /** @private {object} モーダルを格納しておくオブジェクト。なければnull **/
  modals_: {},

  /** @private {App.view.modal} */
  modal_: null,

  /** @private {App.view.Action_bar} */
  action_bar_: null,

  /** @private {App.view.element.Base|null} */
  current_element_view_: null,

  /** @private {App.view.Add_first_element|null} */
  add_first_element_button_view_: null,

  initialize: function () {
    this.views_ = {};
    //collection
    this.collection = new App.collection.Elements();
    this.listenTo(this.collection, 'add', this.element_added_);
    this.listenTo(this.collection, 'remove', this.element_removed_);
    this.listenTo(this.collection, 'sort', this.elements_sorted_);

    //アクションバー
    this.action_bar_ = new App.view.Action_bar();
    this.action_bar_.render();
    this.listenTo(this.action_bar_, 'action', this.action_bar_action_);

    //最初の要素を追加するボタン
    this.add_first_element_button_view_ = new App.view.Add_first_element();
    this.listenTo(this.add_first_element_button_view_, 'add_first_element', this.show_add_element_modal_);

    //コレクションをfetchする
    this.fetch_elements(this.check_elements_empty_.bind(this));
  },
  /**
   * コレクションに新しい要素のモデルが追加された時に、
   * そのモデルを元に要素のViewを作成して表示する
   * @param {App.model.Element} model
   * @returns {App.view.page.standard}
   * @private
   */
  element_added_: function (model) {
    var view = this.create_element_view(model);
    if (view) {
      this.views_[model.cid] = view;
      this.$el.append(view.render().$el);
      this.check_elements_empty_();
    }
    return this;
  },
  /**
   * コレクションからモデルが削除された歳に、
   * そのモデルの要素のViewを削除する
   * @param {App.model.Element} model
   * @returns {App.view.page.standard}
   * @private
   */
  element_removed_: function (model) {
    if (this.views_[model.cid] !== null) {
      delete(this.views_[model.cid]);
    }
    this.check_elements_empty_();
    return this;
  },
  /**
   * 要素のViewの数をチェックして、空だったら最初の要素の追加ボタンを表示する
   * @returns {App.view.page.standard}
   * @private
   */
  check_elements_empty_: function () {
    if (_.size(this.views_) === 0) {
      this.$el.append(this.add_first_element_button_view_.show().$el);
    } else {
      this.add_first_element_button_view_.hide();
    }
    return this;
  },
  /**
   * 要素のモデルからViewを生成する
   * @param {App.model.Element} model
   * @returns {App.view.element.Base|bool} Viewが生成できたらそれを返して、出来なかったらfalseを返す
   */
  create_element_view: function (model) {
    var type = model.get('type');
    if (_.isFunction(App.view.element[type])) {
      var view = new App.view.element[type]({model: model});
      this.listenTo(view, 'mouse_entered', this.element_mouse_entered_);
      this.listenTo(view, 'mouse_leaved', this.element_mouse_leaved_);
      return view;
    }
    return false;
  },
  /**
   * コレクションをfetchする
   * @param {function} cb
   * @returns {App.view.page.standard}
   */
  fetch_elements: function (cb) {
    var options = {};
    if (_.isFunction(cb)) {
      options.complete = cb;
    }
    this.collection.fetch(options);
    return this;
  },
  elements_sorted_: function () {
    this.collection.each((function (model) {
      this.$el.append(this.get_view_from_model_(model).$el);
    }).bind(this));
    return this;
  },
  /**
   * アクションバーのボタンが押された時に実行される
   * @param {string} button_type クリックされたボタンの種類
   * @private
   */
  action_bar_action_: function (button_type) {
    if (this.current_element_view_) {
      switch (button_type) {
        case 'add':
          this.show_add_element_modal_(this.current_element_view_);
          break;
        case 'edit':
          this.current_element_view_.edit();
          this.action_bar_.set_editing();
          break;
        case 'save':
          this.current_element_view_.save();
          this.action_bar_.unset_editing();
          break;
        case 'remove':
          this.show_remove_element_modal_(this.current_element_view_);
          break;
        case 'up':
          this.move_element_(this.current_element_view_, true);
          break;
        case 'down':
          this.move_element_(this.current_element_view_, false);
          break;

      }
    }
    return this;
  },
  /**
   * 要素にホバーされた時にアクションバーをその要素内に移動させる
   * @param element_view
   * @returns {App.view.page.standard}
   * @private
   */
  element_mouse_entered_: function (element_view) {
    this.current_element_view_ = element_view;
    this.action_bar_.move_to_element(element_view);
    element_view.set_active();
    if (element_view.is_editing()) {
      this.action_bar_.set_editing();
    } else {
      this.action_bar_.unset_editing();
    }
    this.action_bar_.show();
    return this;
  },
  /**
   * 要素からホバーアウトされた時にアクションバーを隠す
   * @param element_view
   * @returns {App.view.page.standard}
   * @private
   */
  element_mouse_leaved_: function (element_view) {
    if (this.current_element_view_ && this.current_element_view_ === element_view) {
      this.current_element_view_ = null;
      this.action_bar_.hide().evacuate();
    }
    element_view.clear_active();
    return this;
  },
  /**
   * 指定した種類のモーダルを返す
   * @param {string} modal_type
   * @param {function} initialize
   * @returns {bool|App.view.modal.Base}
   * @private
   */
  get_modal_: function (modal_type, initialize) {
    if (_.isFunction(App.view.modal[modal_type])) {
      if (!this.modals_[modal_type] || !(this.modals_[modal_type] instanceof App.view.modal[modal_type])) {
        this.modals_[modal_type] = new App.view.modal[modal_type]();
        if (_.isFunction(initialize)) {
          initialize(this.modals_[modal_type]);
        }
        this.modals_[modal_type].render();
      }
      return this.modals_[modal_type];
    }
    return false;
  },
  /**
   * 渡されたモデルを元に対応するViewを返す
   * @param {App.model.Element} model
   * @returns {App.view.element.Base|bool} なければfalseを返す
   * @private
   */
  get_view_from_model_: function (model) {
    if (this.views_[model.cid]) {
      return this.views_[model.cid];
    }
    return false;
  },
  /**
   * 渡されたViewを元に対応するモデルを返す
   * @param element_view
   * @returns {null|App.model.Element}
   * @private
   */
  get_model_from_view_: function (element_view) {
    return element_view.model;
  },
  /**
   * 要素を追加するモーダルを表示する
   * @returns {App.view.page.standard}
   * @private
   */
  show_add_element_modal_: function (current_view) {
    var modal = this.get_modal_('Select_add_element', (function (modal) {
      this.listenTo(modal, 'element_selected', this.add_new_element);
    }).bind(this));
    modal.set_current_view(current_view).show();
    return this;
  },
  /**
   * 要素を削除するモーダルを表示する
   * @param {App.view.element.Base} current_view
   * @returns {App.view.page.standard}
   * @private
   */
  show_remove_element_modal_: function (current_view) {
    var modal = this.get_modal_('Remove_element', (function (modal) {
      this.listenTo(modal, 'decide', (function (modal) {
        var view = modal.get_current_view();
        if (view) {
          this.remove_element_(view);
        }
        modal.hide();
      }));
    }).bind(this));
    modal.set_current_view(current_view).show();
    return this;
  },
  /**
   * 新しい要素を追加する
   * @param {string} element_type 要素の種類
   * @param {App.view.element.Base} current_view
   * @returns {App.view.page.standard}
   */
  add_new_element: function (element_type, current_view) {
    var options = {};
    //current_viewが渡された場合はそのviewの後にaddするようにoptionを調整する
    if (current_view && (current_view instanceof App.view.element.Base)) {
      options.at = this.collection.indexOf(this.get_model_from_view_(current_view)) + 1;
    }

    //viewがちゃんと生成されているなら編集モードにする
    var view = this.get_view_from_model_(this.collection.add({type: element_type}, options));
    if (view) {
      this.action_bar_.set_editing();
      view.edit();
    }
    return this;
  },
  /**
   * 要素を削除する
   * @param {App.view.element.Base} element_view
   * @returns {App.view.page.standard}
   * @private
   */
  remove_element_: function (element_view) {
    element_view.model.destroy();
    return this;
  },
  /**
   * 渡された要素を上か下にひとつ移動させる
   * collection内のモデルを並び替えてsortイベントをfireする
   * @param {App.view.element.Base} element_view
   * @param {bool} to_top
   * @returns {App.view.page.standard}
   */
  move_element_: function (element_view, to_top) {
    var current_index = this.collection.indexOf(element_view.model)
      , target_index = null;
    if (!!to_top && current_index > 0) { //最上部の要素でなければ
      target_index = current_index - 1;
    } else if (!to_top && current_index < this.collection.length - 1) { //最下部の要素でなければ
      target_index = current_index + 1;
    }

    //移動可能な要素なら並び替えてsortイベントをfire
    if (target_index !== null) {
      this.collection.remove(element_view.model, {silent: true});
      this.collection.add(element_view.model, {at: target_index, silent: true});
      this.collection.trigger('sort', this.collection);
    }
    return this;
  }
})
;