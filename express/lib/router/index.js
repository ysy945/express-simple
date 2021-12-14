const {
  setPrototypeOf,
  parseUrl,
  getType,
  createError,
  mixin,
} = require("../utils");
const Route = require("./route");
const Layer = require("./layer");
const METHODS = require("../METHODS");

const proto = (module.exports = function () {
  function router(req, res) {
    router.handle(req, res);
  }
  setPrototypeOf(router, proto);
  router.stack = [];
  router.params = {};
  return router;
});

proto.route = function (path) {
  const route = new Route(path);
  const routerLayer = new Layer(path, {}, route.dispatch.bind(route));
  routerLayer.route = route;
  this.stack.push(routerLayer);
  return route;
};

proto.handle = function (req, res, done) {
  const self = this;
  let idx = 0;
  const stack = self.stack;

  const path = parseUrl(req).pathname;
  if (path === null) {
    return done();
  }

  let removed = "";
  req.matchUrl = req.matchUrl || path;

  next();

  function next(err) {
    let layer;
    let match;
    let route;

    if (removed.length !== 0) {
      req.matchUrl = removed + req.matchUrl;
      removed = "";
    }

    while (idx < stack.length && match !== true) {
      layer = stack[idx++];
      match = layer.match(req.matchUrl);
      route = layer.route;

      if (layer.params) {
        if (!req.params) req.params = {};
        mixin(req.params, layer.params);
      }

      if (!match) {
        continue;
      }

      //这是一个中间件
      if (!route) {
        trim_prefix(layer);
        continue;
      }

      const method = req.method;
      const handle_method = route.handle_method(method);

      if (handle_method !== true) {
        match = false;
        continue;
      }

      self.process_params(req, res, layer, function (err) {
        if (err) {
          return next(err);
        }

        if (route) {
          return layer.handle_request(req, res, next);
        }
      });

      function trim_prefix(layer) {
        const layerPath = layer.path;
        if (layerPath.length !== 0) {
          if (layerPath === "/") {
            removed = "";
          } else {
            removed = layerPath;
            req.matchUrl = req.matchUrl.substring(removed.length);
          }
        }

        if (err) {
          return layer.handle_error(err, req, res, next);
        } else {
          return layer.handle_request(req, res, next);
        }
      }
    }
    //没有找到匹配的
    if (match !== true) {
      done();
      return self;
    }
  }
};

proto.process_params = function (req, res, layer, done) {
  /**
   * {
   *  name:[fn]
   * }
   */
  const params = this.params;
  /**
   * {
   *  key:value,
   *  key:value
   * }
   */
  const paramVals = layer.params;
  const keys = layer.keys;

  if (!keys || keys.length === 0) {
    return done();
  }

  let i = 0;
  let paramCallbacksIndex = 0;
  let paramCallbacks;
  let paramVal;
  let key;
  let name;
  function param() {
    //初始化
    paramCallbacksIndex = 0;

    if (i >= keys.length) {
      return done();
    }
    key = keys[i++];
    name = key.name;
    paramCallbacks = params[name];
    paramVal = paramVals[name];

    if (!paramCallbacks || !paramVal) {
      return param();
    }

    paramCallback();
  }
  param();
  function paramCallback() {
    const fn = paramCallbacks[paramCallbacksIndex++];
    if (!fn) {
      return param();
    }
    fn(req, res, paramCallback, paramVal, name);
  }
  return this;
};

proto.use = function (fn, ...rest) {
  let path = "/";
  let resultFns = [];
  const self = this;

  if (getType(fn) === "string") {
    path = fn;
    resultFns = rest;
  }

  if (getType(fn) === "function") {
    resultFns = [fn, ...rest];
  }

  resultFns.forEach((fn) => {
    if (getType(fn) !== "function") {
      const err = "router.use() required callback function";
      createError(err);
    } else {
      const routerLayer = new Layer(
        path,
        {
          end: false,
        },
        fn
      );
      routerLayer.route = undefined;
      self.stack.push(routerLayer);
    }
  });
  return self;
};

proto.param = function (name, fn) {
  if (getType(fn) !== "function") {
    const err = "proto.params required callbakc function ";
    createError(err);
  }
  (this.params[name] = this.params[name] || []).push(fn);
  return this;
};

METHODS.forEach((method) => {
  proto[method] = function (path, ...fns) {
    const route = this.route(path);
    route[method].apply(route, fns);
    return this;
  };
});
