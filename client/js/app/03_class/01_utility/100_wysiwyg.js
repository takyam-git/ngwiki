App.utility.wysiwyg = Backbone.View.extend({
  options: {
    lang: 'ja-JP',
    focus: true,
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video']],
      ['view', ['fullscreen']],
      ['help', ['help']]
    ]
  },
  initialize: function (options) {
    this.options.lang = App.utility.wysiwyg.lang_map[App.config.app.lang];
    if (typeof options === 'object') {
      this.options = _.extend(this.options, options);
    }
  },
  enable: function () {
    this.$el.summernote(this.options);
  },
  disable: function () {
    this.$el.destroy();
  },
  get_html: function(){
    return this.$el.code();
  }
});
App.utility.wysiwyg.lang_map = {
  'ja': 'ja-JP'
};