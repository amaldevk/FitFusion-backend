const express = require("express")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()

const gymRoute=require("./controller/gymRoute")
const packageroute=require("./controller/packageRoute")

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://Taniya12:TAN12122001@cluster0.vfq897t.mongodb.net/gymDb?retryWrites=true&w=majority",{useNewUrlParser:true})

app.use("/api/gym",gymRoute)
app.use("/api/users",packageroute)

app.listen(3005,()=>{
    console.log("Server Running")
})