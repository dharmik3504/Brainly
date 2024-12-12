import express from "express"
import {User} from './db'
const app=express()
app.use(express.json())

app.post("/api/v1/signup",async (req,res)=>{
const {username,password} =req.body

const data= await User.create({
    username,
    password
})
if(data){
    res.status(200).json({message:"user has created now you can login in"})
}
else{
    res.status(401).json({message:"something went wrong"})
}

})
app.post("/api/v1/signin",(req,res)=>{

})
app.post("/api/v1/content",(req,res)=>{

})
app.get("/api/v1/content",(req,res)=>{

})

app.delete("/api/v1/content",(req,res)=>{

})
app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000)