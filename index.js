var app = require('koa')()
  , route = require('koa-route')
  , serve = require('koa-static')
  , views = require('co-views')
  , render = views(__dirname + '/server/view', {map: {html: 'swig'}})
  , sync = require(__dirname + '/server/controller/sync.js')
  , mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/ng_wiki');

app.use(serve(__dirname + '/public'));
app.use(function*() {
  this.body = yield render('index');
});

//preloads
require(__dirname + '/server/initialize/preload.js');

var server = require('http').Server(app.callback())
  , io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('sync', function (data, ack) {
    sync(data.method, data.type, data.path, data.data, ack);
  });
});
server.listen(3000);