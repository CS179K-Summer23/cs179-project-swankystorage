//this is for getting the chats from the profile page
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from "axios";

const Dm = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(''); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation()
  const [roomData, setRoomData] = useState('')
  const [roomId, setRoomId] = useState('')
  const data = location.state.messages
  console.log(data)
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
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(()=>{
    if(roomData && roomData.length > 0){
      const mes = roomData.map((entry) => entry.message)
      setMessages(mes)
    }
  },[roomData])

  const handleJoinRoom = () => {
    if (socket) {
      socket.emit('join room', { room });
    }
  };

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit('chat message', { room:roomId, msg: message});
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Dm