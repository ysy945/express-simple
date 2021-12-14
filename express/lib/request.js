module.exports = req = {}

req.header = function header(name) {
    if (!name) {
      throw new TypeError('name argument is required to req.get');
    }
  
    if (typeof name !== 'string') {
      throw new TypeError('name must be a string to req.get');
    }
  
    var lc = name.toLowerCase();
  
    switch (lc) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer
          || this.headers.referer;
      default:
        return this.headers[lc];
    }
  };