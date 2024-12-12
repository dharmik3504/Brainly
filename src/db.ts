import mongoose, { Types } from 'mongoose';
const {Schema,model,connect} =mongoose


const contentTypes = ['image', 'video', 'article', 'audio']; 
connect("mongodb+srv://admin:JrTcMyvtRZBlsjLC@cluster0.2mnf2.mongodb.net/brainly")
const UserSchema=new Schema({
    username:{type:String,require:true,unique:true},
    password:{type:String,require:true}
})

const TagSchema=new Schema({
    title:{type:String,require:true,unique:true}
})

const ContentSchema=new Schema({
    link:{type:String,require:true},
    type:{type:String,require:true,emum:contentTypes},
    title:{type:String,require:true},
    tag:[{type:Types.ObjectId,ref:"Tag"}],
    userId:{type:Types.ObjectId,ref:"User",require:true}
})

const LinkSchema=new Schema({
    hash:{type:String,require:true},
    userId:{type:Types.ObjectId,ref:"User",require:true}

})

export const User=model("User",UserSchema)
const Content=model("Content",ContentSchema)
const Tag=model("Tag",TagSchema)
const Link=model("Link",LinkSchema)

