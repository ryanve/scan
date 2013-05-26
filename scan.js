/*!
 * scan         querySelectorAll query engine
 * @author      Ryan Van Etten <@ryanve>
 * @link        github.com/ryanve/scan
 * @license     MIT
 * @version     0.4.0
 */
 
/*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true, 
  laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */

(function(root, name, make) {
    typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
}(this, 'scan', function() {

    var doc = document
      , docElem = doc.documentElement
      , effin = {}
      , query = 'querySelectorAll' // caniuse.com/#feat=queryselector
      , compareDocPos = 'compareDocumentPosition'
      , rewrap = 'pushStack'

        /**
         * check if node A contains element B - same as jQuery.contains
         * @param  {Node|*}  a   node to search in
         * @param  {Node|*}  b   elem to search for
         * @return {boolean}     true if B is a child elem of A
         */
      , inNode = docElem.contains || docElem[compareDocPos] ? function(a, b) {
            var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
            return bup && 1 === bup.nodeType ? a === bup || !!(
                adown.contains ? adown.contains(bup) : a[compareDocPos] && a[compareDocPos](bup) & 16
            ) : false;
        } : function(a, b) {
            while (b = b && b.parentNode)
                if (b === a) return true;
            return false;
        }

        /**
         * @param  {(string|null)=}                        selector
         * @param  {(string|Node|NodeList|Array|Object)=}  root
         * @return {Array}
         */
      , qsa = doc[query] ? function(selector, root) {
            if (!selector)
                return [];
            root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
            if (typeof root != 'object')
                return [];
            if (root[query])
                return ary(root[query](selector));
            return amassUnique(root, selector); // root was collection
        } : function() {
            return []; 
        };
    
    /**
     * @param  {Array|Object|NodeList|string} list
     * @return {Array}
     */
    function ary(list) {
        var pure = [], l = list.length, i = 0;
        while (i < l) pure[i] = list[i++];
        return pure;
    }
    
    /**
     * @param  {(string|Node|NodeList|Array|*)=}       selector
     * @param  {(string|Node|NodeList|Array|Object)=}  root
     * @return {Array}
     */
    function scan(item, root) {
        if (!item) return [];
        if (typeof item == 'string') return qsa(item, root);
        return item.nodeType || item.window == item ? [item] : ary(item);
    }

    /**
     * @param  {Array|Object|NodeList}     roots
     * @param  {(string|null)=}            selector
     * @param  {(Array|Object|NodeList)=}  base
     * @param  {Function=}                 engine
     * @return {Array}
     */
    function amassUnique(roots, selector, base, engine) {
        var u, j, group, els = [], e = 0, l = roots.length, i = base ? -1 : 0;
        for (engine = engine || qsa; i < l; i++) {
            group = ~i ? engine(selector, roots[i]) : base;
            label:for (u = 0; group[u]; u++) {
                for (j = e; j--;) {
                    if (els[j] === group[u])
                        continue label;
                }
                els[e++] = group[u];
            }
        }
        return els;
    }
    
    /**
     * @param  {Array|Object}  ob
     * @param  {*}             needle
     * @param  {number=}       start
     * @return {boolean}
     */
    function include(ob, needle, start) {
        var l = ob.length, i = start >> 0;
        l = l !== +l && this['values'] ? (ob = this['values'](ob)).length : l;
        for (0 > i && (i += l); i < l; i++)
            if (ob[i] === needle && i in ob) return true;
        return false;
    }

    /**
     * combines jQuery.contains, _.contains, string.contains
     * @param  {string|Array|Object|Node} ob
     * @param  {*}                        needle
     * @param  {number=}                  start
     * @return {boolean}
     */
    function contains(ob, needle, start) {
        if (typeof ob == 'string') return !!~ob.indexOf(needle, start >> 0);
        return ob.nodeType ? inNode(ob, needle) : include(ob, needle, start);
    }

    /**
     * @param  {string}  str
     * @return {Node|boolean}
     */
    function id(str) {
        return doc.getElementById(str) || false;
    }
    
    /**
     * @param  {Object|Array|NodeList}      collection
     * @param  {Object|Array|NodeList|Node} needle
     * @return {Array}
     */
    function findDown(collection, needle) {
        var j, l, ret = [], i = 0, u = 0, h = collection.length;
        needle = needle.nodeType ? [needle] : needle;
        for (l = needle.length; i < l; i++) {
            for (j = h; j--;) {
                if (inNode(collection[j], needle[i])) {
                    ret[u++] = needle[i];
                    break;
                }
            }
        }
        return ret;
    }
    
    /**
     * @param  {Object|Array|NodeList}                 collection
     * @param  {Object|Array|NodeList|Node|Function|*} needle
     * @param  {*=}                                    scope
     * @return {Array|*}
     */
    function find(collection, needle, scope) {
        return (typeof needle == 'object' ? findDown : detect)(collection, needle, scope);
    }
    
    /**
     * @param  {Object|Array|NodeList} ob
     * @param  {Function}              test
     * @param  {*=}                    scope
     */    
    function detect(ob, test, scope) {
        for (var i = 0, l = ob.length; i < l; i++) {
            if (test.call(scope, ob[i], i, ob))
                return ob[i];
        }
    }
    
    /**
     * @this  {Object|Array|NodeList}
     * @param {Object|Array|NodeList|Node|Function|string|*}  needle
     * @param {*=}                                            scope
     */
    effin['find'] = function(needle, scope) {
        var found;
        if (typeof needle == 'string') found = qsa(needle, this);
        else if (typeof needle == 'object') found = findDown(this, needle);
        else return detect(this, needle, scope);
        return this[rewrap] ? this[rewrap](found) : found;
    };
    
    // Comply w/ api.jquery.com/filter + api.jquery.com/not
    detect(['filter', 'not'], function(key, i) {
        var keep = !i;
        effin[key] = function(q) {
            var kept = [], isF = typeof q == 'function';
            null == q ? (kept = keep ? kept : ary(this)) : detect(this, function(v, j) {
                var fail = isF ? !q.call(v, j) : !include(this, v);
                fail !== keep && kept.push(v);
            }, typeof q == 'string' ? qsa(q) : !isF && q.nodeType ? [q] : q);
            return this[rewrap] ? this[rewrap](kept) : kept;
        };
    });

    scan['scan'] = scan;
    scan['qsa'] = qsa;
    scan['id'] = id;
    scan['inNode'] = inNode;
    scan['contains'] = contains;
    scan['find'] = find;
    scan['fn'] = effin;
    return scan;
}));