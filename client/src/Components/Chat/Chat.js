//this is for the that is made from the reply button on a listing
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from "axios";
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import {Button} from "react-bootstrap"
const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(''); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation()
  const [roomData, setRoomData] = useState('')
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState([])
  const [otherPerson, setOtherPerson] = useState('')
  const data = location.state.owner
  const user = location.state.user
  const nameOfItem = data.nameOfItem
  console.log(user)
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001'); 
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(()=>{
    const fetchRoomId = async() =>{
      try {
        const response = await axios.get("http://localhost:3001/dm/" + data.owner)
        setRoomId(response.data._id)
      } catch (error) {
          console.log("Error fetching the room id: ", error)
      }
    }
    fetchRoomId()
  },[data.owner])

  useEffect(()=>{
    const fetchUser = async() =>{
      try {
        const response = await axios.get("http://localhost:3001/userId/" + data.owner)
        console.log(response.data.name.userName)
        setOtherPerson(response.data.name.userName)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [data.owner])

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/room/" + data.owner);
        setRoomData(response.data);
        // console.log(roomData)
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRoomData(); 
    // console.log("this is the room id:", roomData[0].room._id)
  }, [data.owner]);
  

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on('chat message', (message) => {
        // setMessages((prevMessages) => [...prevMessages, message]);
        // setName((prevNames)=>[...prevNames,user])
      });
    }
  }, [socket]);

  useEffect(()=>{
    if(roomData && roomData.length > 0){
      const mes = roomData.map((entry) => entry.message)
      const u = roomData.map((entry)=> entry.sender.userName)
      setMessages(mes)
      setName(u)
    }
  },[roomData])

  useEffect(()=>{
    if (socket) {
      socket.emit('join room', { room: roomId });
    }
  },[roomId,socket])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit('chat message', { room:roomId, msg: message});
      setMessages((prevMessages) => [...prevMessages, message]);
      setName((prevNames)=>[...prevNames,user])
      setMessage('');
    }
  };

  const userTitle = () => {
    return <p style={{ fontStyle: "italic", marginBottom: "0px" }}>You</p>
  }

  const otherUserTitle = () => {
    return <p style={{ fontWeight: "bold", marginBottom: "0px" }}>{otherPerson}</p>
  }

  return (
    <>
    <CustomNavbar/>
    <div style={{backgroundColor:'white', justifyContent: "center"}}>
      <h1 style={{textAlign:'center'}}>{nameOfItem}-{otherPerson}</h1>
      {/* <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div> */}
      <div style={{maxWidth:'100vw', overflow:'hidden', backgroundColor:'white', marginLeft:'25vw', marginRight:'25vw', borderRadius:'2%'}}>
        {messages.map((msg, index) => {
          const displayName = name[index];
          const isUserMessage = displayName === user;
          return (
              <>
              <p style={{
                  textAlign: isUserMessage ? 'right' : 'left',
                  marginLeft: isUserMessage ? 'auto' : '10%',
                  marginRight: isUserMessage ? '10%' : 'auto',
                  maxWidth: '25%', 
                  marginBottom:'1px',
                  overflowWrap:'break-word',
              }}>
                {isUserMessage && userTitle()}
              </p>
              <p style={{
                  textAlign: isUserMessage ? 'right' : 'left',
                  marginLeft: isUserMessage ? 'auto' : '10%',
                  marginRight: isUserMessage ? '10%' : 'auto',
                  maxWidth: '25%', 
                  marginBottom:'1px',
                  overflowWrap:'break-word',
              }}>
                {!isUserMessage && otherUserTitle()}
              </p>
              <p
                key={index}
                style={{
                  textAlign: isUserMessage ? 'right' : 'left',
                  padding: '8px',
                  marginLeft: isUserMessage ? 'auto' : '10%',
                  marginRight: isUserMessage ? '10%' : 'auto',
                  maxWidth: '25%', 
                  backgroundColor: isUserMessage ? 'lightblue' : 'lightgray',
                  borderRadius: '8px',
                  marginBottom:'8px',
                  overflowWrap:'break-word',
                  marginTop:'4px'
                }}
              >
                 {msg}
              </p>
              </>
            );
          })}
      <div style={{maxWidth:'100%', overflow:'hidden', backgroundColor:'white', marginLeft:'10%', marginRight:'10%', display: 'flex', flexFlow: 'row'}}>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: '5px', borderRadius: '2%', marginRight: '10px', width:'87%' }}
        />
        <Button variant='success' onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
      </div>
    </>
  );
};

export default ChatRoom;