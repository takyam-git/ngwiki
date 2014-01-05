require('co')(function *() {
  var fs = require('co-fs')
    , server_path = __dirname + '/..'
    , targets = [
      server_path + '/model'
    ];
  for (var i = 0; i < targets.length; i++) {
    var files = yield fs.readdir(targets[i]);
    for (var n = 0; n < files.length; n++) {
      if (/\.js$/.test(files[n])) {
        require(targets[i] + '/' + files[n]);
      }
    }
  }
})();