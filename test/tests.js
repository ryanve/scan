(function(root, document) {
    var aok = root['aok']
      , scan = root['scan']
      , docElem = document.documentElement
      , byClass = 'getElementsByClassName'
      , byTag = 'getElementsByTagName'
      , hasByClass = !!document[byClass];

    // Use alert if console is unavail.
    aok.prototype.express.force = true;

    aok({
        id: 'qsaBasic',
        test: function() {
            return scan.qsa('div').length === document[byTag]('div').length &&
                (!hasByClass || scan.qsa('.div').length === document[byClass]('div').length);
        }
    });
    aok({
        id: 'contains',
        test: function() {
            return true === scan.contains('string', 's') &&
                true === scan.contains('string', 'ring') &&
                false === scan.contains('string', 'a') &&
                true === scan.contains(docElem, docElem[byTag]('*')[0]) &&
                false === scan.contains(docElem[byTag]('*')[0], docElem) &&
                true === scan.contains([0, 1, 2], 1) &&
                false === scan.contains([0, 1, 2], 3) &&
                false === scan.contains({}, 1);
        }
    });
}(this, document));