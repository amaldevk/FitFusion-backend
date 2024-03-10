const express = require("express")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()

const member=require("./controller/member")
const adminRoute = require("./controller/adminRoute")
const packageroute=require("./controller/packageRoute")
const Trainerroute=require("./controller/TrainerRouter")
const transroute=require("./controller/transaction")
const subscriptionRoute=require("./controller/subscriptionRoute")
const historyRoute=require("./controller/historyRoute")
const approvalRouter=require("./controller/approvalRouter")


app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://Taniya12:TAN12122001@cluster0.vfq897t.mongodb.net/gymDb?retryWrites=true&w=majority",{useNewUrlParser:true})

app.use("/api/member",member)
app.use("/api/admin",adminRoute)
app.use("/api/packages",packageroute)
app.use("/api/trainer",Trainerroute)
app.use("/api/tran",transroute)
app.use("/api/subscription",subscriptionRoute)
app.use("/api/history",historyRoute)
app.use("/api/approval",approvalRouter)




app.listen(3006,()=>{
    console.log("Server Running")
})