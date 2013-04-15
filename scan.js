/*!
 * scan         querySelectorAll query engine
 * @author      Ryan Van Etten <@ryanve>
 * @link        github.com/ryanve/scan
 * @license     MIT
 * @version     0.2.0
 */

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
            return bup && 1 === bup.nodeType ? a === bup || !!(
                (adown = 9 === a.nodeType ? a.documentElement : a).contains 
                    ? adown.contains(bup)
                    : a[compareDocPos] && a[compareDocPos](bup) & 16
            ) : false;
        } : function(a, b) {
            if (b) while (b = b.parentNode) {
                if (b === a) return true;
            } return false;
        }

        /**
         * @param  {string|*} selector
         * @param  {(Node|NodeList|Array|Object)=}  root
         * @return {Array|NodeList}
         */
      , qsa = doc[query] ? function(selector, root) {
            var group, j, u, l, i, e, els = []; 
            if (!selector)
                return els;
            root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
            if (typeof root != 'object')
                return els;
            if (root[query])
                return root[query](selector);

            // (selector, collection)
            // accumulate unique nodes
            l = root.length;
            e = i = 0;
            while (i < l) {
                group = qsa(selector, root[i++]);
                label:for (u = 0; group[u]; u++) {
                    for (j = e; j--;) {
                        if (els[j] === group[u])
                            continue label;
                    } els[e++] = group[u];
                }
            }
            return els;
        } : function(selector, root) {
            return []; 
        };
    
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