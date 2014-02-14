/*!
 * scan 0.6.0+201402141031
 * https://github.com/ryanve/scan
 * MIT License 2014 Ryan Van Etten
 */

(function(root, name, make) {
  if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
  else root[name] = make();
}(this, 'scan', function() {

  var effin = {}
    , doc = document
    , docElem = doc.documentElement
    , chain = 'pushStack'
    , byAll = 'querySelectorAll'
    , byTag = 'getElementsByTagName'
    , query = doc[byAll] ? byAll : byTag
    , compare = 'compareDocumentPosition'    

      /**
       * @param {Node|*} a element or document to search in
       * @param {Element|*} b element to search for
       * @return {boolean} true if A contains B
       */
    , wraps = docElem.contains || docElem[compare] ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
        return bup && 1 === bup.nodeType ? a === bup || !!(
          adown.contains ? adown.contains(bup) : a[compare] && a[compare](bup) & 16
        ) : false;
      } : function(a, b) {
        while (b = b && b.parentNode) if (b === a) return true;
        return false;
      };

  /**
   * @param {string=} selector
   * @param {(string|Node|NodeList|Array|Object)=} root
   * @return {Array}
   */
  function qsa(selector, root) {
    if (!selector) return [];
    root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
    return typeof root != 'object' ? [] : root.nodeType ? (
      root[query] ? ary(root[query](selector)) : []
    ) : amass(selector, root); // root was collection
  }

  /**
   * @param {Array|Object|NodeList|string|*} list
   * @return {Array}
   */
  function ary(list) {
    var pure = [], l = list.length, i = 0;
    while (i < l) pure[i] = list[i++];
    return pure;
  }
  
  /**
   * @param {(string|Node|{length:number}|*)=} item
   * @param {(string|Node|{length:number})=} root
   * @return {Array}
   */
  function scan(item, root) {
    if (!item) return [];
    if (typeof item == 'string') return qsa(item, root);
    return item.nodeType || item.window == item ? [item] : ary(item);
  }

  /**
   * @param {string} selector
   * @param {Array|Object|NodeList} roots nodes from which to base queries
   * @return {Array} unique matches that descend from any `roots` item
   */
  function amass(selector, roots) {
    for (var u, j, group, els = [], e = 0, l = roots.length, i = 0; i < l;) {
      group = qsa(selector, roots[i++]);
      label:for (u = 0; group[u]; u++) {
        for (j = e; j--;) if (els[j] === group[u]) continue label;
        els[e++] = group[u];
      }
    }
    return els;
  }
  
  /**
   * @param {Array|Object} stack
   * @param {*} needle
   * @param {number=} start
   * @return {boolean}
   */
  function include(stack, needle, start) {
    var l = stack.length, i = start >> 0;
    for (0 > i && (i += l); i < l; i++)
      if (stack[i] === needle && i in stack) return true;
    return false;
  }

  /**
   * combines jQuery.contains, _.contains, string.contains
   * @param {string|Array|Object|Node} ob
   * @param {*} needle
   * @param {number=} start
   * @return {boolean}
   */
  function contains(ob, needle, start) {
    if (typeof ob == 'string') return !!~ob.indexOf(needle, start >> 0);
    return ob.nodeType ? wraps(ob, needle) : include(ob, needle, start);
  }
  
  /**
   * @param {{length:number}} nodes
   * @param {{length:number}|Element} needles
   * @return {Array} descendant needles
   */
  function contained(nodes, needles) {
    var j, l, ret = [], i = 0, h = nodes.length;
    needles = needles.nodeType ? [needles] : needles;
    for (l = needles.length; i < l; i++) {
      for (j = 0; j < h;) {
        if (wraps(nodes[j++], needles[i])) {
          ret.push(needles[i]);
          break;
        }
      }
    }
    return ret;
  }

  /**
   * @param {string} str
   * @return {Element|boolean}
   */
  function id(str) {
    return doc.getElementById(str) || false;
  }

  /**
   * @param {{length:number}} ob
   * @param {Function} fn
   * @param {*=} scope
   */
  function detect(ob, fn, scope) {
    for (var v, i = 0, l = ob.length; i < l;)
      if (fn.call(scope, v = ob[i], i++, ob)) return v;
  }
  
  /**
   * @param {string|Node|{length:number}|*} ob
   * @param {(string|Node|{length:number}|Function|null)=} fn
   * @param {*=} scope
   */
  function find(ob, fn, scope) {
    return typeof fn == 'function' ? detect(ob, fn, scope) : scan(ob, fn);
  }
  
  /**
   * @this {{length:number}}
   * @param {{length:number}|Element|Function|string|*} needle
   * @param {*=} scope
   */
  effin['find'] = function(needle, scope) {
    var found;
    if (typeof needle == 'string') found = amass(needle, this);
    else if (typeof needle == 'object') found = contained(this, needle);
    else return detect(this, needle, scope);
    return this[chain] ? this[chain](found) : found;
  };
  
  // Comply w/ api.jquery.com/filter + api.jquery.com/not
  detect(['not', 'filter'], function(key, keep) {
    effin[key] = function(q) {
      var kept = [], isF = typeof q == 'function';
      if (q) detect(this, function(v, j) {
        var fail = isF ? !q.call(v, j) : !include(this, v);
        fail == keep || kept.push(v);
      }, typeof q == 'string' ? qsa(q) : q.nodeType ? [q] : q);
      else kept = keep ? kept : ary(this);
      return this[chain] ? this[chain](kept) : kept;
    };
  });

  scan['scan'] = scan;
  scan['qsa'] = qsa;
  scan['id'] = id;
  scan['inNode'] = wraps;
  scan['contains'] = contains;
  scan['find'] = find;
  scan['fn'] = effin;
  return scan;
}));