const express=require("express")
const cors=require("cors")
const { PrismaClient } = require('@prisma/client')
//const ServerlessHttp=require("serverless-http")
const { Server } = require("http")

const PORT=3000
const app=express();
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE"],
    credentials: true
  }));
app.use(express.json());
const prisma=new PrismaClient();

app.get("/hello",(req,res)=>{
    res.status(200).json({
        message:"Hello"
    })
})


app.post("/createTodos",async (req,res)=>{
    const body=req.body
    try{
        const response=await prisma.todos.create(
            {
                data:{
                    name:body.name,
                    description:body.description,
                    completed:false
                }
            }
        )
        if(!response){
            return res.status(403).json({
                message:"Error"
            })

        }
        console.log(response)
        res.status(200).json({
            message:response
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:"Server Error"
        })
    }
})

app.get("/getTodos",async(req,res)=>{
    try{
        const response=await prisma.todos.findMany()
        if(!response){
            return res.status(403).json({
                message:"Error"
            })
        }
        console.log(response)
        res.status(200).json({
            response
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message:e
        })
    }
})

app.post("/complete",async (req,res)=>{
    const body=req.body;
    try{
        const response=await prisma.todos.update({
            data:{
                completed:true
            },
            where:{
                id:body.id
            }
        })
        if(!response){
         return res.status(403).json({
             message:"Error"
         })
     }
     res.status(200).json({
         message:"Marked complete"
     })
     }catch(e){
         res.status(500).json({
             message:"Server Error"
         })
     }
})

app.delete("/deleteTodos",async (req,res)=>{
    const body=req.body;
    console.log(body)
    try{
        const response=await prisma.todos.delete({
            where:{
                id:body.id
            }
        })
        if(!response){
         return res.status(403).json({
             message:"Error"
         })
     }
     res.status(200).json({
         message:"Deleted"
     })
     }catch(e){
        console.log("delete")
         res.status(500).json({
             message:"Server Error"
         })
     }
})

app.listen(PORT)

