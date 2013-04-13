/* ender.jit.su bridge */
(function ($, name) {
    if ($) {
        name = require(name);
        $['ender'](name['fn'], true);
        $['_select'] = name['qsa'];
    }
}(this['ender'], 'scan'));