var { mixin } = require("../utils");
var parseUrl = require("parseurl");
var qs = require("qs");

module.exports = function query(options) {
  var opts = mixin({}, options);
  var queryparse = qs.parse;

  if (typeof options === "function") {
    queryparse = options;
    opts = undefined;
  }

  if (opts !== undefined && opts.allowPrototypes === undefined) {
    // back-compat for qs module
    opts.allowPrototypes = true;
  }

  return function query(req, res, next) {
    if (!req.query) {
      var val = parseUrl(req).query;
      if (val) {
        req.query = queryparse(val, opts);
      }
    }
    next();
  };
};
