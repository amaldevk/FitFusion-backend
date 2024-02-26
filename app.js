const express = require("express")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()

const member=require("./controller/member")

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://taniya:taniya123@cluster0.zld0daa.mongodb.net/gymappDb?retryWrites=true&w=majority",{useNewUrlParser:true})

app.use("/api/member",member)

app.listen(3005,()=>{
    console.log("Server Running")
})