const express = require('express')
const session = require('express-session')
const crypto = require('crypto')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
const key = crypto.randomBytes(64).toString('hex')

//session details
//cookie session false since we are only on localhost
app.use(session({
    secret:key,
    resave:false,
    saveUninitialized:true,
    cookie: {secure:false},
}))

var currentSession
const Schema = mongoose.Schema;

const user = new Schema({
  email: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("user", user);

const listing = new Schema({
  nameOfItem: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  picture: { type: String, required: true },
  description: { type: String, required: true },
  categories: [{ type: String, required: true }],
}, { timestamps: true });


const listingModel = mongoose.model("listing", listing)
//remember to change to actual routes.
app.post("/register", async (req, res) => {
  try {
    const newUser = new userModel({
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
    });

    await newUser.save();
    console.log("User Saved to Mongo");
    res.status(200).json({ message: "User successfully registered" });
  } catch (error) {
    console.log("error saving data to MongoDB: ", error);
    res.status(500).json({ error: "Error saving user information" });
  }
});

//to create new user
app.post("/register", async (req, res)=> {

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

//to login user
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
            req.session.user = existingUser;
            const userStatus = existingUser.role === "admin" ? "admin" : "user";
            req.session.save()
            currentSession = req.session
            console.log(req.session.user)
            res.status(200).json({status: "Success", role: userStatus})
        }
        else{
            console.log("user does not exist")
            // res.redirect("/register")
            res.status(401).json({error: "User is not a registered user"})
        }   

    }catch(error){
        console.log("error: ", error);
        res.status(500).json({error:"Login error"});
  }
});

app.get("/new-listing", async (req, res) => {
  try {
    const listings = await listingModel.find({});
    res.json(listings);
  } catch (error) {
    console.log("error getting data to MongoDB: ", error);
    res.status(500).json({ error: "Error getting listing information" });
  }
});

app.post("/new-listing", async (req, res) => {
  try {
    const newListing = new listingModel({
      nameOfItem: req.body.nameOfItem,
      price: req.body.price,
      location: req.body.location,
      picture: req.body.picture,
      description: req.body.description,
      categories: req.body.categories
    });

    newListing.createdAt = new Date();
    newListing.updatedAt = new Date();

    await newListing.save();
    console.log("Listing Saved to Mongo");
    res.status(200).json({ message: "Listing successfully created" });
  } catch (error) {
    console.log("error saving data to MongoDB: ", error);
    res.status(500).json({ error: "Error saving listing information" });
  }
});

//get user info for profile page
//uncomment res.status(401) whenever testing is done so that the
//redirect works properly
app.get('/profilePage', async(req,res)=>{
    const user = currentSession;
    console.log(user)
    if(user){
        res.status(200).json(user)
    }
    else{
        res.status(401).json({message:"User is not logged in"})
        // res.redirect('/login')
    }
})


//to handle logouts
app.get('/logout', async(req,res)=>{
    try{
      req.session.destroy();
      console.log("user has been logged out")
      res.status(200).json({message: "User has been sucessfully logged out"})
    }catch(error){
      console.log("something went wrong with logging out")
      res.status(500).json({error})
    }
    
})



//creates new listing
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
//for filter
app.get("/filter-listings", async (req, res) => {
  try {
    const filterCriteria = req.query.query;
    const listings = await listingModel.find(filterCriteria);
    console.log("Filtered by ", JSON.stringify(req.query.query));
    //console.log(listings)
    res.status(200).json(listings);
  } catch (error) {
    console.log("error getting filtered listings: ", error);
    res.status(500).json({ error: "Error getting filtered listings" });
  }
});

app.get("/listing/:id", async (req, res) => {
  try {
    const listings = await listingModel.findOne({ _id: req.params.id });
    res.json(listings);
  } catch (error) {
    console.log("error getting data to MongoDB: ", error);
    res.status(500).json({ error: "Error getting listing information" });
  }
});



mongoose.connect(
  "mongodb+srv://apate198:swankystorage@cluster0.z8xre3k.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
app.listen(3001, () => {
  console.log("on port 3001");
});


