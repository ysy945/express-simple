const {mixin} = require("./utils")
const EventEmitter = require("events").EventEmitter
const proto = require("./application")
const request = require("./request")
const response = require("./response")
const expressInit = require("./middleware/init")
const query = require("./middleware/qurey")
const Router = require("./router")
const Route = require("./router/route")
const Layer = require("./router/layer")


function createApplication(){
    function app (req,res){
        app.handle(req,res)
    }
    mixin(app,proto)
    mixin(app,EventEmitter)

    app.use(expressInit(app))
    app.use(query({}))

    app.request = Object.create(request,{
        app:{
            configurable:true,
            writable:true,
            value:app,
            enumerable:true
        }
    })

    app.response = Object.create(response,{
        app:{
            configurable:true,
            writable:true,
            value:app,
            enumerable:true
        }
    })
    return app
}

createApplication.Router = Router
createApplication.response = response
createApplication.Route = Route
createApplication.Layer = Layer



module.exports = createApplication