const express = require("express")
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product")
const app = express();
const Jwt = require('jsonwebtoken');
const jwtKey = "dashboard";

app.use(express.json());
app.use(cors());

 // register api

app.post("/register",async(req,res)=>{   
    let user= new User(req.body);
    let result= await user.save();

    result = result.toObject();   //add 19 20 lines for hiding password
    delete result.password

Jwt.sign({result},jwtKey, {expiresIn:"2h"},(err,token)=>{
    if(err){
        res.send({result:"something went wrong,try again"})
    }
    res.send({result , auth:token})
})
 
})

  // login api

app.post("/login",async (req,res)=>{    
    console.log(req.body)
    if(req.body.password && req.body.email)
    {
        let user= await User.findOne(req.body).select("-password")
        if(user)
        {
            Jwt.sign({user},jwtKey, {expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.send({result:"something went wrong,try again"})
                }
                res.send({user , auth:token})
            })
          
        }
        else{
            res.send({result:'No User Found'})
        }
    }else {
        res.send({ result: "No User Found"})
    }
  
})

// add product api

app.post("/add-product", verifyToken , async (req,res)=>{      
    let product =new Product(req.body);
    let result = await product.save();
    res.send(result)
})

 // product list api 

app.get("/products",verifyToken,  async (req,res)=>{          
    let products = await Product.find();

    if(products.length>0)
    {
        res.send(products)
    }
    else
    {
        res.send({result:"No Products Found"})
    }
}) 

  //delete product api

app.delete("/product/:id", verifyToken , async (req,res)=>{          
    let  result= await Product.deleteOne({_id:req.params.id})
    res.send(result);
})

 // api for get single data for update
 
app.get("/product/:id", verifyToken , async (req,res)=>{              
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }else{
        res.send({result:'No Record Found'})
    }   
})

app.put("/product/:id" , verifyToken , async (req,res)=>{
    let result = await Product.updateOne(
        {_id: req.params.id},
        {
            $set: req.body
        }
    )
    res.send(result)
} );

       // search api 

app.get("/search/:key",verifyToken ,async (req,res)=>{          
    let result = await Product.find({
        "$or": [
            {name: {$regex: req.params.key}},
            {company: {$regex: req.params.key}}
        ]
    })
    res.send(result)
})

//verify token

function verifyToken(req , res , next){
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(" ")[1];
       
        Jwt.verify(token, jwtKey , (err,valid)=>{
            if(err){
               
                res.status(401).send({result : "please provide valid token"})
                
            }else{

                 next();
            }
        })
    } else {
        res.status(403).send({result : "please add token with header"})
    }
   
}

app.listen(5000);