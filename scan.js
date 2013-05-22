/*!
 * scan         querySelectorAll query engine
 * @author      Ryan Van Etten <@ryanve>
 * @link        github.com/ryanve/scan
 * @license     MIT
 * @version     0.2.1
 */
 
 /*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true, 
  laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */

(function(root, name, make) {
    typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
}(this, 'scan', function() {
    
    var doc = document
      , docElem = doc.documentElement
      , query = 'querySelectorAll' // caniuse.com/#feat=queryselector
      , compareDocPos = 'compareDocumentPosition'

        /**
         * check if node A contains element B - same as jQuery.contains
         * @param  {Node|*}  a   node to search in
         * @param  {Node|*}  b   elem to search for
         * @return {boolean}     true if B is a child elem of A
         */
      , inNode = docElem.contains || docElem[compareDocPos] ? function(a, b) {
            var adown, bup = b && b.parentNode;
            return bup && 1 === bup.nodeType ? a === bup || !!((
                    adown = 9 === a.nodeType ? a.documentElement : a
                ).contains ? adown.contains(bup) : a[compareDocPos] && a[compareDocPos](bup) & 16
            ) : false;
        } : function(a, b) {
            if (b) while (b = b.parentNode) {
                if (b === a) return true;
            } return false;
        }

        /**
         * @param  {(string|null)=}                            selector
         * @param  {(string|Node|NodeList|Array|Object|null)=} root
         * @return {Array|NodeList}
         */
      , qsa = doc[query] ? function(selector, root) {
            if (!selector)
                return [];
            root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
            if (typeof root != 'object')
                return [];
            if (root[query])
                return root[query](selector);
            return amassUnique(root, selector); // root was collection
        } : function() {
            return []; 
        };
        
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
     * combines jQuery.contains, _.contains, string.contains
     * @param  {Node|Array|Object|string} ob
     * @param  {*}                        needle
     * @param  {number=}                  i
     * @return {boolean}
     */
    function contains(ob, needle, i) {
        return ob.nodeType ? inNode(ob, needle) : include(ob, needle, i);
    }
    
    function include(ob, needle, i) {
        i >>= 0;
        if (ob.indexOf)
            return !!~ob.indexOf(needle, i);
        var l = ob.length;
        for (i = 0 > i ? i + l : i; i < l; i++) {
            if (i in ob && ob[i] === needle)
                return true;
        } return false;
    }
    
    /**
     * @param  {string}  str
     * @return {Node|boolean}
     */
    function id(str) {
        return doc.getElementById(str) || false;
    }
    
    /**
     * @param  {Object|Array}               collection
     * @param  {Object|Array|Node|Function} needle
     * @param  {Object=}                    scope
     * @return {Array|*}
     */    
    function find(collection, needle, scope) {
        var ret, j, l, i = 0, u = 0, h = collection.length;
        if (typeof needle == 'object') {
            ret = [];
            needle = needle.nodeType ? [needle] : needle;
            for (l = needle.length; i < l; i++) {
                for (j = h; j--;) {
                    if (inNode(collection[j], needle[i])) {
                        ret[u++] = needle[i];
                        break;
                    }
                }
            }
        } else for (; i < h; i++) {
            if (needle.call(scope, collection[i], i, collection))
                return collection[i];
        } return ret;
    }
    
    /**
     * @param  {*=} $
     * @return {Function}
     */    
    function relayFind($) {
        $ = typeof $ == 'function' && $;
        function fnFind(needle, scope) {
            var ret = typeof needle == 'string' ? qsa(needle, this) : find(this, needle, scope);
            return $ && typeof needle != 'function' ? $(ret) : ret;
        }
        fnFind['relay'] = relayFind;
        return fnFind;
    }

    return {
        'qsa': qsa
      , 'id': id
      , 'inNode': inNode
      , 'contains': contains
      , 'find': find 
      , 'fn': {
            'find': relayFind()
        }
    };
}));