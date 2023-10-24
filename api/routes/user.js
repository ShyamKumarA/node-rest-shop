const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');

// const Order=require("../models/orderModel")
// const Product=require("../models/productModel")
const User=require("../models/userModel")



router.post('/signup',(req,res)=>{

    User.find({email:req.body.email}).then(user=>{
        if(user.length>=1){
            return res.status(409).json({
                message:"Mail exists"
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else{
                    const user=new User ({
                        email:req.body.email,
                        password:hash
                })
                user.save().then(result=>{
                    res.status(201).json({
                        message:"User Created",
                        userDetails:result

                    })
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
                })
            }
        })
        }
    })
    
        
})

router.delete('/',(req,res)=>{
    const id=req.query.id;
    User.findByIdAndRemove({_id:id}).then(result=>{
        res.status(200).json({
            message:"User deleted"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


module.exports=router;
