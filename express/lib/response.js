module.exports = res = {};

res.status = function (code) {
  this.statusCode = code;
  return this;
};

res.get = function (field) {
  return this.getHeader(field);
};

res.set = res.header = function header(field, val) {
  if(arguments.length !== 2){
      throw new Error("res.header required two arguments")
  }
  if(Array.isArray(val)){
      val = val.map(String)
      if(field.toLowerCase() === "content-type"){
          throw new Error("content-type can not set type of array")
      }
      else{
          this.setHeader(field,value)
      }
  }
  return this
};

res.type = function(value){
    res.setHeader("Content-type",value)
    return this
}

res.send = function(body){
   
  if (arguments.length === 2) {
    
    if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
      console.wran('res.send(body, status): Use res.status(status).send(body) instead');
      this.statusCode = arguments[1];
    } else {
      console.warn('res.send(status, body): Use res.status(status).send(body) instead');
      this.statusCode = arguments[0];
     
    }
  }

  switch(typeof body){
      case "object":
          res.end(JSON.stringify(body))
          break
      case "string":
         if(!this.getHeader("Content-Type")){
             this.type("html")
         }
         res.end(body)
  }
}
