App.io = io.connect('/');
App.io.on('connect', function(){
  App.connected = true;
});
App.io.on('disconnect', function(){
  App.connected = false;
});