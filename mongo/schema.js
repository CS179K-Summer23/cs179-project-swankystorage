const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const Schema = mongoose.Schema;

const user = new Schema({
    email: {type:String, required:true},
    userName: {type:String, required:true},
    password: {type:String, required:true},

});

const userModel = mongoose.model("user", user);

const listing = new Schema({
    nameOfItem: {type:String, required:true},
    price: {type:Number, required:true},
    location: {type:String, required:true},
    picture: {type:String, required:true},
    description: {type:String, required:true},
});

const listingModel = mongoose.model("listing", listing)

//remember to change to actual routes. 
app.post("/signup", async (req, res)=> {

    try {
        const newUser = new userModel({
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
        });
    
        await newUser.save()
        console.log("User Saved to Mongo")
        res.status(200).json({message: "User successfully registered"})      
    } catch (error) {
        console.log("error saving data to MongoDB: ", error);
        res.status(500).json({error: "Error saving user information"})
    }
});

app.post("/login", async(req,res)=> {
    try{
        const userToFind = {
            email: req.body.email,
            password:req.body.password,
        }
        const existingUser = await userModel.findOne({
            email: userToFind.email,
            password: userToFind.password
        });
        if(existingUser){
            console.log("User exists")
            res.status(200).json({message: "User exists"})
        }
        else{
            console.log("user does not exist")
            res.status(404).json({message: "user does not exist"})
        }   

    }catch(error){
        console.log("error: ", error);
        res.status(500).json({error:"Login error"});
    }

});





app.post("/new-listing", async (req, res)=> {
    try{
        const newListing = new listingModel({
            nameOfItem: req.body.nameOfItem,
            price: req.body.price,
            location: req.body.location,
            picture: req.body.picture,
            description: req.body.description,
        });
        await newListing.save()
        console.log("Listing Saved to Mongo")
        res.status(200).json({message: "Listing successfully created"})
    }
    catch(error){
        console.log("error saving data to MongoDB: ", error);
        res.status(500).json({error: "Error saving listing information"})
    }
    
});

//replace username and password 
mongoose.connect("mongodb+srv://apate198:swankystorage@cluster0.z8xre3k.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true, useUnifiedTopology:true 
})
app.listen(3001,()=>{
    console.log("on port 3001")
})