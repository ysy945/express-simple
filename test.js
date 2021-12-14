const express = require("./express")
const router = require("./express").Router()
const app = express()
// const router = require("./express/lib/router")()
// const router2 = require("./express/lib/router")()

// app.get("/name",function(req,res,next){
//     console.log(2);
//     next("我是错误中间件1")
// },function(err,req,res,next){
//     console.log(err);
//     next("123")
// })

// app.use("/name",function(err,req,res,next){
//     console.log(err);
//     next("我是错误中间件2")
// })

// app.use("/name",function(err,req,res,next){
//     console.log(err);
//     res.end("asd")
// })

app.get("/age",function(req,res){
    console.log(req.query);
    res.end("age")
})

// app.params(["id","name"],function(req,res,next,value,name){
//     if(name === "id"){
//         req.params.id = value + "111"
//     }
//     if(name === "name"){
//         req.params.name = value +"111"
//     }
//     next()
// })

// app.params("id",function(req,res,next,value,name){
//     console.log(req.params);
//     next()
// })

// app.get("/:id/:name",function(req,res){
//     console.log(req.params);
//     res.end("123")
// })
const callback = function(req,res){
    console.log(req.params,req.query);
    res.end("123")
}


router.get("/:id",callback)

app.use("/name",router)

app.listen("3000",function(err){
    if(!err)console.log("服务器启动了");
})