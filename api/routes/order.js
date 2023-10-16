const express = require('express');
const router=express.Router();

const Order=require("../models/orderModel")
const Product=require("../models/productModel")



router.get('/',async(req,res,next)=>{
    const id=req.query.id;

    try{
        if(id){
            const orderdetails=await Order.findById(id)
            res.status(200).json({
                orders:orderdetails,
                request: {
                    type: 'GET',
                    description: 'GET',
                    url: 'http://localhost:3001/orders',
                  },
                message:"Order were fetched",

            })

        }else{
            const orders=await Order.find().select('product quantity _id');
            res.status(200).json({
                count: orders.length,
                orders: orders.map(doc => {
                    return{
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                          type: 'GET',
                          url: 'http://localhost:3001/orders?id=' + doc._id,
                        }
                    }
                 
                }),
            })
                
            
            

        }


    }catch(error){
        console.log(error);
        res.status(500).json({
            error: error,
          });
    }
    
})

router.post('/',async(req,res)=>{
    try{
    //     console.log(req.body.product);
    // const productData=await Product.findById(req.body.product)
    // console.log(productData);
    // if(productData){ 
        const order=new Order({
            quantity:req.body.quantity,
            product:req.body.product
        })  
            const orderdetails=await order.save()
            res.status(200).json({
            message:"Order was Created",
            myOrder:orderdetails,
            request:{
                type:"GET",
                url:"http://localhost:3001/orders",
    
            }
        })

    // }else{
    //     return res.status(404).json({
    //         message:"Product not found"
    //       });
       
        
    // }  

    }catch(error){
        console.log(error);
        res.status(500).json({
            error: error,
          });
    }
    
})

module.exports=router;