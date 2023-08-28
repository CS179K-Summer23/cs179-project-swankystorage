//this is for getting the chats from the profile page
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from "axios";
import { Button } from "react-bootstrap";
import CustomNavbar from '../CustomNavbar/CustomNavbar';
const Dm = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(''); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation()
  const [roomData, setRoomData] = useState('')
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState([])
  const data = location.state.messages
  const user = location.state.user
  const nameOfRoom = location.state.nameOfRoom
  const otherUser = location.state.otherUser
  // console.log(nameOfRoom)
  // console.log(otherUser)
  useEffect(() => {
    const newSocket = io('http://localhost:3001'); 
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(()=>{
    try {
        if(!(data[0].room._id)){
            const fetchRoomId = async() =>{
                try {
                  const response = await axios.get("http://localhost:3001/dm/" + data.rooms.participants[0])
                  setRoomId(response.data._id)
                } catch (error) {
                    console.log("Error fetching the room id: ", error)
                }
              }
              fetchRoomId()
        }
        else{
          setRoomId(data[0].room._id)
        }
    } catch (error) {
        console.log(error, "There was an error setting the rooms id")
    }
  },[data])

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRoomData(); 
    // console.log("this is the room id:", roomData[0].room._id)
  }, [data]);
  

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('chat message', (message) => {
        // setMessages((prevMessages) => [...prevMessages, message]);
        // setName((prevNames)=> [...prevNames, user])
      });
    }
  }, [socket]);

  useEffect(()=>{
    if(roomData && roomData.length > 0){
      const mes = roomData.map((entry) => entry.message)
      const u = roomData.map((entry) => entry.sender.userName)
      setMessages(mes)
      setName(u)
    }
  },[roomData])

  useEffect(()=>{
    if (socket) {
      socket.emit('join room', { room: roomId });
    }
  },[socket,roomId])

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit('chat message', { room:roomId, msg: message});
      setMessages((prevMessages) => [...prevMessages, message]);
      setName((prevNames)=> [...prevNames, user])
      setMessage('');
    }
  };

  return (
    <>
    <CustomNavbar />
    <div style={{backgroundColor:'white'}}>
      <h1 style={{textAlign:'center'}}>{nameOfRoom}-{otherUser}</h1>
      {/* <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div> */}
      <div style={{maxWidth:'100%', overflow:'hidden', backgroundColor:'white', marginLeft:'30%', marginRight:'30%', borderRadius:'2%'}}>
        {messages.map((msg, index) => {
          const displayName = name[index];
          const isUserMessage = displayName === user;
          return (
              <p
                key={index}
                style={{
                  textAlign: isUserMessage ? 'left' : 'right',
                  padding: '8px',
                  marginLeft: isUserMessage ? '10%' : 'auto',
                  marginRight: isUserMessage ? 'auto' : '10%',
                  maxWidth: '25%', 
                  backgroundColor: isUserMessage ? 'lightblue' : 'lightgray',
                  borderRadius: '8px',
                  marginBottom:'4px',
                  overflowWrap:'break-word',
                  marginTop:'4px'
                }}
              >
                 {msg}
              </p>
            );
          })}
      <div style={{maxWidth:'100%', overflow:'hidden', backgroundColor:'white', marginLeft:'10%', marginRight:'10%', borderRadius:'5%'}}>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: '5px', borderRadius: '2%', marginRight: '10px', width:'87%' }}
        />
        <Button variant='success' onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
      </div>
    </>
  );
}

export default Dm