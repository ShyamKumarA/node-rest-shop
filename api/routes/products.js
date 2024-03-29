const express = require('express');
const router=express.Router();
const Product=require("../models/productModel");
const multer = require('multer');
const checkAuth=require("../middleware/check-auth")

const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
        
    }
})

const fileFilter=(req,file,cb)=>{
    //reject a file
    if(file.mimetype==='image/jpeg'|| file.mimetype==='image/png'){
    cb(null,true);

    }else{
        cb(null,false);

    }
}

const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*5
},
    fileFilter:fileFilter})


router.get('/',async(req,res,next)=>{
    const id=req.query.id;
    if(id){
        await Product.findById(id).then(result=>{
            res.status(200).json({
                productDetails:result,
                request:{
                    type:"GET",
                    description:"GET",
                    url:"http://localhost:3001/products"
                }
             })
        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        });
    }else{  
    Product.find().select("name price _id productImage").exec().then(docs=>{
        console.log(docs);
        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:"http://localhost:3001/products?id="+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}
})
    

   


router.post('/',checkAuth,(req,res,next)=>{
   //console.log(req.file);
    const product=new Product({
        name:req.body.name,
        price:req.body.price,
        //productImage:req.file.path
    })
    product.save().then(doc=>{
        console.log(doc);
        res.status(201).json({
            message:"Created product success",
            createProduct:{
                name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:"http://localhost:3001/products?id="+doc._id
                    }
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
    
})


    
router.delete('/',checkAuth,async(req,res)=>{
    try{
        const id=req.query.id;
        await Product.findByIdAndRemove({_id:id});
        res.status(200).json({
            message:"product delete successfully",
            request:{
                type:"post",
                url:"http://localhost:3001/products",
                body:{
                    name:'String',
                    price:"Number"
                }

            }
        })

    }catch(error){
        console.log(error);
    }
    

})

router.patch("/",checkAuth,async(req,res)=>{
    try{
        const id=req.query.id;
        const updateOps={}
        for(const ops of req.body){
            updateOps[ops.propName]=ops.value;
        }
        const update=await Product.updateOne({_id:id},{$set:updateOps})
        res.status(200).json({
            message:"Product updated",
            request:{
                productDetails:update,
                type:"GET",
                url:"http://localhost:3001/products?id="+id
            }
        });

    }catch(error){
        console.log(error);
    }
})
   
    


module.exports=router;