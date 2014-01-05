App.utility.dom = {
  /**
   * event.targetから希望する要素を取得して返す
   * @param {object} event
   * @param {string} expect_node_name
   * @returns {jQuery}
   */
  get_target: function (event, expect_node_name) {
    var $dom = $(event.target);
    if (event.target.nodeName.toLowerCase() !== expect_node_name) {
      $dom = $dom.parents(expect_node_name);
    }
    return $dom;
  }
};