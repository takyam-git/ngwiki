App.template.modal = _.template([
  '<div class="modal-dialog">',
    '<div class="modal-content">',
      '<div class="modal-header">',
        '<button type="button" class="close" data-dismiss="modal">&times;</button>',
        '<h4 class="modal-title">&nbsp;</h4>',
      '</div>',
      '<div class="modal-body"></div>',
      '<div class="modal-footer">',
        '<button type="button" class="btn btn-default modal-footer-cancel" data-dismiss="modal">閉じる</button>',
        '<button type="button" class="btn btn-primary modal-footer-decide">実行</button>',
      '</div>',
    '</div>',
  '</div>'
].join(''));