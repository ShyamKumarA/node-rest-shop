const express = require('express');
const router=express.Router();

const Order=require("../models/orderModel")
const Product=require("../models/productModel")



router.get('/',async(req,res,next)=>{
    
    try{
        const id=req.query.id;
    console.log(id);
        if(id){
            const orderdetails=await Order.findById(id).populate('product')
            console.log(orderdetails);
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
            const orders=await Order.find().select('product quantity _id').populate('product');
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

router.post('/', async (req, res) => {
    try {
      const productData = await Product.findById(req.body.product);
  
      if (!productData) {
        // If product is not found, return a 404 response
        return res.status(404).json({
          message: "Product not found"
        });
      }
  
      const order = new Order({
        quantity: req.body.quantity,
        product: req.body.product
      });
  
      const orderdetails = await order.save();
  
      res.status(200).json({
        message: "Order was Created",
        myOrder: orderdetails,
        request: {
          type: "GET",
          url: "http://localhost:3001/orders"
        }
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error
      });
    }
  });



  router.delete('/',async(req,res)=>{
    const id=req.query.id;
    console.log(id);
    try{
        const orderData=await Order.findById(id)
        console.log(orderData);
        if(orderData){
            await Order.findByIdAndRemove(id);
            res.status(200).json({
                message:"Order delete successfully",
                request:{
                    type:"post",
                    url:"http://localhost:3001/Order",
                    body:{
                        product:'String',
                        quantity:"Number"
                    }
    
                }
            })
        }else{
            res.status(404).json({
                message:"Product id not found"
            })
        }
    }catch(error){
        res.status(500).json({
            message:"Product id not found"
        })

    }
  })
  

module.exports=router;