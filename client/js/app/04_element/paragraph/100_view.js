App.view.element.paragraph = App.view.element.Base.extend({
  wysiwyg: null,
  $wysiwyg: null,
  template: _.template('<div class="js-element-paragraph-container"><%= text %></div>'),
  events: _.extend({
    'click .js-element-paragraph-container': 'paragraph_clicked'
  }, App.view.element.Base.prototype.events),
  before_: null,
  initialize: function () {
    App.view.element.Base.prototype.initialize.call(this);
    this.listenTo(Backbone.Events, 'other_clicked', 'body_clicked');
  },
  render: function () {
    App.view.element.Base.prototype.render.call(this);

    //WYSIWYG生成済みならdestroy()しておく
    if (this.$wysiwyg && _.isFunction(this.$wysiwyg.destroy)) {
      this.$wysiwyg.destroy();
      this.$wysiwyg.remove();
    }
    var current_html = this.model.get_data('contents');
    console.log(current_html);
    this.$wysiwyg = $(this.template({text: (current_html ? current_html : '<p>&nbsp;</p>')}));
    this.wysiwyg = new App.utility.wysiwyg({el: this.$wysiwyg});
    this.$container.empty().append(this.$wysiwyg);
    return this;
  },
  enable_wysiwyg: function () {
    if (this.wysiwyg) {
      this.wysiwyg.enable();
    }
    return this;
  },
  disable_wysiwyg: function () {
    if (this.wysiwyg) {
      this.wysiwyg.disable();
    }
    return this;
  },
  edit: function () {
    App.view.element.Base.prototype.edit.call(this);
    this.before_ = this.model.get_data('contents');
    this.enable_wysiwyg();
    return this;
  },
  save: function (cb) {
    App.view.element.Base.prototype.save.call(this);
    if (this.wysiwyg) {
      var html = this.wysiwyg.get_html();
      this.model.set_data('contents', html);
      this.model.save({}, {
        success: (function () {

        }).bind(this),
        error: (function () {
          console.log(arguments);
          this.model.set_data('contents', this.before_);
        }).bind(this),
        complete: (function (err, model, response) {
          var contents = model.get_data('contents');
          this.disable_wysiwyg();
          this.$wysiwyg.html(contents ? '' + contents : '<p>&nbsp;</p>');
          if (_.isFunction(cb)) {
            cb();
          }
        }).bind(this)
      });
    }
    this.before_ = null;
    return this;
  },
  added: function () {
    this.edit();
    return this;
  },
  other_clicked: function () {
    this.save();
    return this;
  }
});