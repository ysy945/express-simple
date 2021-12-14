const {pathToRegexp} = require("path-to-regexp")

function Layer(path,opts,handler){
   this.path = undefined
   this.keys = []
   this.name = handler.name || "<anonymous>"
   this.Regexp = pathToRegexp(path,this.keys,opts)
   this.handler = handler
   this.params = undefined
}

Layer.prototype.handle_request = function(req,res,next){
   const handler = this.handler

   if(handler.length>3){
      return next()
   }

   try{
      handler(req,res,next)
   }
   
   catch(err){
      next(err)
   }
   
}

Layer.prototype.handle_error = function(err,req,res,next){
   const handler = this.handler
   if(handler.length!==4){
      return next(err)
   }
   
   try{
      handler(err,req,res,next)
   }
   catch(error){
      next(error)
   }
}

Layer.prototype.match = function(path){
   let self = this
   let match
   const keys = this.keys

   match = this.Regexp.exec(path)
   if(this.Regexp.test("/")){
       this.path = match[0]
       return true
   }
   //匹配成功
   if(match !== null){
         self.params = {}
         keys.forEach((key,index)=>{
            const name = key.name
            const value = match[index+1]
            self.params[name] = self.params[name]?self.params[name]:value
         })
         this.path = match[0]
         return true
   }
   return false
}

module.exports = Layer

// const keys = []
// const res = pathToRegexp("/name",keys,{end:true}).exec("/name/:id")
// console.log(keys,res);