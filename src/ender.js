!function(root, name) {
  var api = require(name)
    , ender = root.ender
    , dj = root.dj;
    
  if (ender) {
    ender._select = api;
    ender.ender(api.fn, true);
    ender['contains'] = api.contains;
  }
  
  if (dj) {
    dj.hook('select', api.qsa);
    dj.submix(api);
  }
}(this, 'scan');