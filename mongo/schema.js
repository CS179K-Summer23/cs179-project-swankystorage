const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const Schema = mongoose.Schema;

const user = new Schema({
    email: String,
    userName: String,
    password: String,

});

const userModel = mongoose.model("user", user);

const listing = new Schema({
    nameOfItem: String,
    price: Number,
    location: String,
    picture1: String,
    picture2: String,
    picture3: String,
    description: String,


});
const listingModel = mongoose.model("listing", listing)

//remember to change to actual routes. 
app.post("/new-user", async (req, res)=> {

    try {
        const newUser = new userModel({
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
        });
    
        await newUser.save()
        console.log("Saved to Mongo")
        res.status(200).json({message: "User successfully registered"})      
    } catch (error) {
        console.log("error saving data to MongoDB: ", error);
        res.status(500).json({error: "Error saving user information"})
    }
});

app.post("/new-listing", async (req, res)=> {
    try{
        const newListing = new listingModel({
            nameOfItem: req.body.nameOfItem,
            price: req.body.price,
            location: req.body.location,
            picture1: req.body.picture1,
            picture2: req.body.picture2,
            picture3: req.body.picture3,
            description: req.body.description,
        });
        await newListing.save()
        console.log("Saved to Mongo")
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