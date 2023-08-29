import CustomNavbar from "../CustomNavbar/CustomNavbar";
import { Button, Container, Card, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { useState, useEffect } from "react";
import MainApp from "../AddListingModal/MainApp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "../Dashboard/Dashboard";

//const properties = [
//  { key: 0, label: "Product Name", prop: "name", type: "text" },
//  { key: 1, label: "Product Description", prop: "description", type: "text" },
//  { key: 2, label: "Minimum Price", prop: "minPrice", type: "number" },
//  { key: 3, label: "Maximum Price", prop: "maxPrice", type: "number" },
//  { key: 4, label: "Location", prop: "location", type: "text" },
//];

//function requestToMongoQuery(request) {
//  let mongoQuery = {
//    nameOfItem: request.name,
//    price: { $gte: Number(request.minPrice), $lte: Number(request.maxPrice) },
//    location: request.location,
//    description: request.description,
//  };
//  for (let key in mongoQuery) {
//    if (!mongoQuery[key]) delete mongoQuery[key];
//  }
//  if (!mongoQuery.price.$gte) mongoQuery.price.$gte = 0;
//  if (!mongoQuery.price.$lte) mongoQuery.price.$lte = 2e10;
//  if (mongoQuery.description)
//    mongoQuery.description = { $regex: "/" + request.description + "/" };
//  return mongoQuery;
//}

function ProfilePage(args) {
  let [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  let [email, setEmail] = useState("");
  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rooms, setRooms] = useState([])
  const [receiver, setReceivers] = useState([])
  const [names, setNames] = useState([])
  const [uid, setUid] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProfile = async() =>{
      axios
      .get("http://localhost:3001/profilePage")
      .then((response) => {
        setUser(response.data.user);
        console.log(response.data);
        setUid(response.data.user._id)
        setEmail(response.data.user.email);
        setUserName(response.data.user.userName);
        setPassword(response.data.user.password);
        setListings(response.data.listings);
        setRooms(response.data.rooms)
      })
      .catch((error) => {
        setError(error);
      });
    }
    fetchProfile()
  }, []);

  useEffect(()=>{
      try {
        const roomReceivers = rooms.map((key) => (
          uid === key.participants[1] ? key.participants[0] : key.participants[1]
        ));
        setReceivers(roomReceivers);
      } catch (error) {
        console.log(error)
      }
  },[uid,rooms])

  useEffect(()=>{
    try {
      const fetchUserNames = async () =>{
        const usernames = await Promise.all(receiver.map((key)=> axios.get("http://localhost:3001/userId/" + key)))
        setNames(usernames) 
      }
      fetchUserNames()          
    } catch (error) {
      console.log(error)
    }
  }, [receiver])
  
  const passWordVisibilityButtonClicked = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const passwordToDisplay = (display) => {
    if (display) {
      return password;
    } else {
      var obfuscatedPassword = "";
      for (let i = 0; i < password.length; i++) {
        obfuscatedPassword += "*";
      }
      return obfuscatedPassword;
    }
  };

  const goToDm = async (roomId, roomName, username) =>{
    try {
      // console.log(roomId)
      const response = await axios.get('http://localhost:3001/roomById/' + roomId)
      // console.log(userName)
      navigate("/dm", {state: {messages: response.data, user: userName, nameOfRoom: roomName, otherUser: username}})
    } catch (error) {
      console.log(error)
    }
  }

  //const getQueryResult = (query) => {
  //  console.log("query: ", query);
  //  axios
  //    .get("http://localhost:3001/filter-listings", { params: { query } })
  //    .then((response) => {
  //      //console.log("Filtered: ", response)
  //      args.load(response.data);
  //    });
  //};

  return (
    <>
      <CustomNavbar />
      <Container fluid className="mainContainer">
        <div className="informationContainer d-flex" style={{display:"flex", flexDirection:"row"}}>
          <Card style={{ padding: "10px", width:'50%', height:'100%', maxHeight: "100%"}}>
            <p>
              <span className="userNameTitle">
                <b>User Name: </b>
              </span>
              <span className="userNameText">{userName}</span>
            </p>
            <p>
              <span className="emailTitle">
                <b>Email: </b>
              </span>
              <span className="emailText">{email}</span>
            </p>
            <p>
              <span className="passwordTitle">
                <b>Password: </b>
              </span>
              <span className="passwordText">
                {passwordToDisplay(isPasswordVisible)}
              </span>
            </p>
            <Button
              variant="primary"
              className="showPasswordButton"
              onClick={passWordVisibilityButtonClicked}
            >
              Show Password
            </Button>
            
          </Card>
          <Card className="messagesContainerProfilePage" style={{ padding: "10px", width:'50%', maxHeight: '100%'}}>
            <p className="messagesTitleProfilePage">Messages</p>
            <div className="messageContainerProfilePage">
              {rooms.map((room,index)=>{  
                const usernameD = names[index]?.data?.name
                const username = usernameD?.userName
                return(
                    <button style={{width: "22%"}} className="messagesButtonToDMProfilePage"key={index} 
                      onClick={() => goToDm(room._id, room.name, username)} 
                      >
                      {room.name}-<span className="userNameMessagesProfilePage">{username}</span>
                    </button>
                )
                })}
            </div>
          </Card>
        </div>
        {/* <div>
          {rooms.map((room,index)=>{  
            const usernameD = names[index]?.data?.name
            const username = usernameD?.userName
            return(
              <button key={index} onClick={() => goToDm(room._id)}>{room.name}-{username}</button>
            )
            })}
        </div> */}
        <Row>
          <h1>My Listings</h1>
          <MainApp
            listings={listings}
            update={(data) => {
              setListings(data);
            }}
          />
        </Row>
      </Container>
    </>
  );
}

export default ProfilePage;
