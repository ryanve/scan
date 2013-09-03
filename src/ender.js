/*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true, 
  laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */

(function (root, name) {
    // ender.jit.su bridge
    var $ = root['ender']
      , x = require(name);
    if ($) {
        $['_select'] = x;
        $['pushStack'] = $['pushStack'] || $;
        if ($['submix']) {
            $['submix'](x);
        } else {
            $['ender'](x['fn'], true);
            $['contains'] = x['contains'];
        }
    }
    // github.com/ryanve/dj
    if ($ = root['dj']) {
        $['hook']('select', x['qsa']);
        $['bridge'].call(x, $);
    }
}(this, 'scan'));