const { mixin } = require("../utils");

module.exports = function (app) {
  return function expressInit(req, res, next) {
    // console.log(req);
    req.res = res
    res.req = req
    req.next = next
    
    mixin(req, app.request);
    mixin(res, app.response);
    next();
  };
};
