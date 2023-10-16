const express = require('express');
const app=express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan=require('morgan');

const productRoutes=require("./api/routes/products")
const orderRoutes=require("./api/routes/order")

mongoose.connect("mongodb://127.0.0.1:27017/restapi").then(()=>{
    console.log('connected...');
  }).catch((err)=>{
    console.log(err);
  })

  mongoose.Promise=global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*")
    res.header('Access-Control-Allow-Header','Origin, X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Method','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next();
})

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);


app.use((req,res,next)=>{
    const error =new Error('page not found')
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})


module.exports=app;