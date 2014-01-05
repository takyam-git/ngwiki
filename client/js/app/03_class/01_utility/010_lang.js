App.utility.lang = function (string) {
  if(typeof App.lang[App.config.app.lang] === 'undefined'
    || !App.lang[App.config.app.lang]
    || !App.lang[App.config.app.lang][string]){
    return string;
  }
  return App.lang[App.config.app.lang][string];
};
__ = App.utility.lang;