const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http")
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const key = crypto.randomBytes(64).toString("hex");
const server = http.createServer(app)
const {Server} = require('socket.io');
const { error } = require("console");
const e = require("express");
const io = new Server(server,{
  cors:{
    origin:"*"
  }
});
//session details
//cookie session false since we are only on localhost
app.use(
  session({
    secret: key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

var currentSession;
var loggedIn = false;

const Schema = mongoose.Schema;

const user = new Schema({
  email: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  favorites: { type: Array, required: true },
});

const userModel = mongoose.model("user", user);

const citySchema = new mongoose.Schema({
  city: String,
  latitude: Number,
  longitude: Number,
});

const City = mongoose.model('City', citySchema);

// API routes
app.get('/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/cities/city/:cityName', async (req, res) => {
  try {
    const cityName = req.params.cityName;
    
    const cities = await City.find({ city: { $regex: `^${cityName}`, $options: 'i' } });
    
    if (cities.length === 0) {
      res.status(404).json({ error: 'No cities found with that name' });
      return;
    }
    
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const listing = new Schema(
  {
    nameOfItem: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    picture: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: Array, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const listingModel = mongoose.model("listing", listing);

//message schema
const messageSchema = new Schema({
  message: {type: String, required: true},
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
  room: { type: mongoose.Schema.Types.ObjectId, ref: "rooms", required: true},
},
{
  timestamps: true,
}
);

const messageModel = mongoose.model("message", messageSchema)

//room schema
const roomSchema = new Schema({
  name: {type:String},
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user",}]
},
{
  timestamps: true,
})

const roomModel = mongoose.model("rooms", roomSchema)




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

//to login user
app.post("/login", async (req, res) => {
  try {
    const userToFind = {
      email: req.body.email,
      password: req.body.password,
    };
    const existingUser = await userModel.findOne({
      email: userToFind.email,
      password: userToFind.password,
    });
    if (existingUser) {
      console.log("User exists");
      req.session.user = existingUser;
      const userStatus = existingUser.role === "admin" ? "admin" : "user";
      req.session.save();
      currentSession = req.session;
      loggedIn = true;
      console.log(currentSession.user);
      res.status(200).json({
        status: "Success",
        role: userStatus,
        favorites: existingUser.favorites,
        userName: existingUser.userName,
      });
    } else {
      console.log("user does not exist");
      // res.redirect("/register")
      res.status(401).json({ error: "User is not a registered user" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Login error" });
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

//creates new listing
app.post("/new-listing", async (req, res) => {
  try {
    const newListing = new listingModel({
      nameOfItem: req.body.nameOfItem,
      price: req.body.price,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      radius: req.body.radius,
      picture: req.body.picture,
      description: req.body.description,
      categories: req.body.categories,
      owner: currentSession.user._id
    });

    newListing.createdAt = new Date();
    newListing.updatedAt = new Date();

    await newListing.save();
    console.log(req.body.city);
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
app.get("/profilePage", async (req, res) => {
  if (loggedIn) {
    const user = currentSession.user;
    const listings = await listingModel.find({
      owner: currentSession.user._id,
    });
    const rooms = await roomModel.find({participants:currentSession.user._id})
    res.status(200).json({ listings, user, rooms  });
  } else {
    res.status(401).json({ message: "User is not logged in" });
    //res.redirect('/login')
  }
});

//to handle logouts
app.get("/logout", async (req, res) => {
  req.session.destroy();
  currentSession = req.session;
  loggedIn = false;
  console.log("logged out");
  res.status(200).json({ message: "User has been logged out" });
});

//fetches all listings
app.get("/new-listing", async (req, res) => {
  try {
    req.session.destroy();
    console.log("user has been logged out");
    res.status(200).json({ message: "User has been sucessfully logged out" });
  } catch (error) {
    console.log("something went wrong with logging out");
    res.status(500).json({ error });
  }
});

//for filter
app.get("/filter-listings", async (req, res) => {
  try {
    const filterCriteria = req.query.query;
    let sortCriteria = req.query.sort;
    if (!sortCriteria) sortCriteria = {nameOfItem:1}
    console.log("Filtered by ", JSON.stringify(req.query.query), " Sorted by ", JSON.stringify(sortCriteria));
    const listings = await listingModel.find(filterCriteria).sort(sortCriteria);
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

app.get("/listing/user/:id", async (req, res) => {
  try {
    const users = await userModel.findOne({ _id: req.params.id });
    res.json(users);
  } catch(err) {
    console.log("Error fetching data from MongoDB: ", err);
    res.status(500).json({ error: "Error getting author of post" });
  }
});

app.post("/update-favorites", async (req, res) => {
    try {
        console.log("Changing favorites to ", req.body.favorites)
        console.log("For user ", req.body.name)
        const response = await userModel.updateOne( 
                {userName: req.body.name},
                {$set: {favorites: req.body.favorites}}
        )
        currentSession.user.favorites = req.body.favorites
        
        res.status(200).json({ message: "Success", favorites: currentSession.user.favorites })
    } catch (error) {
        console.log("error updating favorites: ", error)
        res.status(500).json({ message: "error updating favorites" })
    }
});
    
app.delete("/listing/:id", async (req, res) => {
  try {
    const listingId = req.params.id;
    const result = await listingModel.findByIdAndDelete(listingId);

    if (!result) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing successfully deleted" });
  } catch (error) {
    console.log("Error deleting the listing: ", error);
    res.status(500).json({ error: "Error deleting the listing" });
  }
});

app.put("/listing/:id", async (req, res) => {
  try {
    const listingId = req.params.id;
    const updatedData = req.body;

    const updatedListing = await listingModel.findByIdAndUpdate(
      listingId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res
      .status(200)
      .json({ message: "Listing successfully updated", updatedListing });
  } catch (error) {
    console.log("Error updating the listing: ", error);
    res.status(500).json({ error: "Error updating the listing" });
  }
});

async function saveMessage({ text, sender, room }){
  console.log("text, sender, room",text, sender, room)
  const message = new messageModel({ message:text, sender:sender, room:room });
  await message.save();
  return message;
}
//creates a new room. Should pass in the name of listing's owner
app.post("/createRoom", async(req, res)=>{
  try {
    const receiverUsername = req.body.id
    const nameOfRoom = req.body.name
    const receiver = await userModel.findById({_id:receiverUsername})
    const sender = await userModel.findById({_id: currentSession.user._id})
    const roomExists = await roomModel.findOne({participants:[receiver,sender]})
    if(roomExists){
      res.status(200).json({message:"room already exists"})
    }
    else{
      const newRoom = new roomModel({name:nameOfRoom, participants:[receiver, sender]})
      await newRoom.save()
      res.status(200).json({message: "The room has been successfully created"})
    }
    // console.log("A new room has been created", newRoom)
    // console.log("this is the current user: ", currentSession)
    // console.log("this is the sender: ", sender)
    // if(sender){
    //   console.log("room added for sender")
    //   sender.rooms.push(newRoomForSender)
    //   await sender.save()
    // }
    // if(receiver){
    //   console.log("room added for receiver")
    //   receiver.rooms.push(newRoomForReceiver)
    //   await receiver.save()
    // }
  } catch (error) {
    console.log(error, "Error creating a new room")
    res.status(500).json({error: "Failed to create the new room"})    
  }
})

//test this
//post new message to room, unsure if this works as intended
app.post("/message", async (req, res)=> {
  try {
    const text = req.body.text;
    const sender = req.body.user;
    const room = req.body.room;
    const message = new messageModel({message: text, sender: sender, room: room});
    await message.save();
    res.status(200).json({message:"Message saved to the room"});
  } catch (error) {
    console.log(error, " could not send the message");
    res.status(500).json({error:"Error saving the message to the room"});
  }
})

//retrieves the room id 
app.get("/dm/:id", async(req, res)=>{
  try {
    const receiver = req.params.id
    const receiver2 = await userModel.findById(receiver)
    const sender = currentSession.user._id
    const room = await roomModel.findOne({participants:[receiver2,sender]})
    if(room){
      res.status(200).json(room)
    } 
  } catch (error) {
    console.log(error, "Error getting the dm info")
    res.status(500).json({message:"Could not retrieve room id"})
  }
})

//to get messages from a specific room given the listing owners id
app.get("/room/:id", async(req, res) => {
  try {
    const receiver = req.params.id
    const receiver2 = await userModel.findById(receiver)
    
    const sender = currentSession.user._id
    // console.log("this is the receiver: ", receiver2)
    // console.log("This is the sender: ", sender)
    const room = await roomModel.findOne({participants:[receiver2,sender]})
    if(!room){
      console.log("room cannot be found")
      res.status(404).json({message:"Room cannot be found"})
    }
    else{
      const messages = await messageModel.find({room: room._id}).populate("sender room")
      console.log(messages)
      res.json(messages)
    }
  } catch (error) {
    console.log("error retrieving messages for this room")
    res.status(500).json({message: "There was an error retrieving the messages for this room"})
  }
  
})

//finds the room by the rooms id and then returns all the messages for that room
app.get("/roomById/:id", async(req, res) => {
  try {
    const rid = req.params.id
    const room = await roomModel.findById(rid)
    if(!room){
      res.status(200).json({message: "This room does not exist anymore"})
    }
    else{
      const messages = await messageModel.find({room:room._id}).populate("sender room")
      res.json(messages)
    }
  } catch (error) {
    console.log("error retrieving messages for this room")
    res.status(500).json({message: "There was an error retrieving the messages for this room"})
  }
  
})

app.get("/userId/:id", async(req, res) => {
  try {
    const uid = req.params.id
    const name = await userModel.findById(uid)
    res.status(200).json({name})
  } catch (error) {
    console.log("error retrieving user id")
    res.status(500).json({message: "There was an error retreiving the user id"})
  }
})

io.use((socket,next) => {
  if(currentSession){
    next();
  }
  else{
    console.log("user is not logged in for sockets")
    next(error("user is not logged in to use the socket"))
  }
})


io.on('connection', (socket) => {
  console.log('User connected');
  const joinRoom = (room) => {
    socket.join(room.room);
    console.log("user has joined the room")
  };

  const leaveRoom = (room) => {
    socket.leave(room.room);
    console.log("user has left the room")
  };

  const sendMessageToRoom = (room, message) => {
    console.log('Received message:', message);
    io.to(room).emit('chat message', message);
  };

  socket.on('join room', (room) => {
    joinRoom(room);
  });

  socket.on('leave room', (room) => {
    leaveRoom(room);
  });

  socket.on('chat message', (data) => {
    saveMessage({
      text: data.msg,
      sender: currentSession.user._id,
      room: data.room,
    })
    sendMessageToRoom(data.room, data.msg);
  });

  socket.on('disconnect', () => {
    console.log('left the room');
  });

});


mongoose.connect(
  "mongodb+srv://apate198:swankystorage@cluster0.z8xre3k.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
server.listen(3001, () => {
  console.log("on port 3001");
});
