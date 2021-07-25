// const path = require("path");
const express = require("express");
const jwt = require ("jsonwebtoken");
const RecipeData = require ('./src/model/recipe');
const UserData = require ('./src/model/user');
// const mongoose = require("mongoose");
// const db = require("./db/db");
// const header_middleware = require("./middlewares/header");

// const RecipeRouter = require("./Routes/recipe");
// const userRoutes = require("./Routes/user");
// const profileRoutes = require("./Routes/profile");

var cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;


//signup
app.post('/adduser' , function (req,res){
    console.log("Added");
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log("in ");
    console.log(req.body);

    // var password = req.body.user.paswd;
    // const hashedPsw =  bcrypt.hash(password,12);

    var user = {
        // fname : req.body.user.fname.trim(),
        // lname : req.body.user.lname.trim(),
        // email : req.body.user.email.trim(),
        // phno : req.body.user.phno.trim(),
        username : req.body.user.username.trim(),
        // paswd : req.body.user.paswd
    }

    var user = new UserData(user);
     user.save();
});

app.post('/login' , function(req,res){
    console.log("login");
    let username = req.body.username;

    if(username == "admin"){
        let payload = {subject: username};
        let token = jwt.sign(payload,'secretKey');
        console.log(token);
        res.status(200).send({token,username});
    }
    else{

    UserData.findOne({username : username})
    .then(function(user){
            let payload = {subject: username};
            let token = jwt.sign(payload,'secretKey');
            console.log(token);
            let userid = user._id;
            res.status(200).send({token,userid}); 
            console.log("inside");    
    })
    .catch(function(){
        res.status(401).send("Invalid username");
        console.log("Invald");
    })
    }
})

function verifyToken(req,res,next){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    if(!req.headers.authorization){       
        return res.status(401).send('Unauthorized request');
    }
    
    let token = req.headers.authorization.split(' ')[1];  
    if(token == "null"){
        return res.status(401).send('Unauthorized request');
    }
    
    let payload = jwt.verify(token , 'secretKey');
    console.log(payload);
    if(!payload){
        return res.status(401).send("Unauthorized request");
    }
    req.userId = payload.subject;
    next();   //if correct user request 

}

app.get('/myrecipes/:userid' ,verifyToken, function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");

    const userId = req.params.userid;
    RecipeData.find({"UserID":userId})
    .then(function(recipes){ 
        res.send(recipes);
    });
});
app.get('/recipe/:userid',function(req,res){
    const userId = req.params.id;
    RecipeData.find({"UserID":userId})
    .then(function(recipe){ 
        res.send(recipe);
    });
});

app.post('/insertrecipe/:userid' ,verifyToken, function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    const UserId = req.params.userid;
    console.log("insertion done");
    console.log(req.body);

    var recipe = {
        UserID : UserId,
        title : req.body.recipe.title,
    }

    var recipe = new RecipeData(recipe); 
    recipe.save();
});

app.get('/recipe/:id' , (req,res)=>{

    const id = req.params.id; 
    
    RecipeData.findOne({"_id":id})
    .then((recipe)=>{
        res.send(recipe);
    })
})

//updation
app.put('/updaterecipe/:userid' ,verifyToken, function(req,res){
    console.log("updation done" +req.body);
    const UserId = req.params.userid;

    id = req.body._id,
    UserID = UserId,
    title = req.body.title,
    
    RecipeData.findByIdAndUpdate({"_id" : id },
                                  {$set : {
                                      "UserID" : UserID,
                                      "title" : title,                              
                                  }})
    .then(function(){
        res.send();
    })                                  
})
// delete post
app.delete('/removerecipe/:id' ,verifyToken, function(req,res){
    id = req.params.id;
    RecipeData.findByIdAndDelete({ "_id" : id })
    .then(()=>{
        console.log('deleted');
        res.send();
    })
})

app.delete('/deleterecipe/:id',function(req,res){
    const id = req.params.id;
    RecipeData.remove({_id: id})
    .then(function(){
        res.status(200).json({id});
    })
});
app.listen(port,()=>{console.log("Server Ready at "+port)});

