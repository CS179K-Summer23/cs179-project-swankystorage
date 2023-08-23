import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from "axios";
const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(''); 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation()
  const [roomData, setRoomData] = useState('')
  const data = location.state.owner
  console.log(data)
  useEffect(() => {
    const newSocket = io('http://localhost:3001'); 
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/room/" + data.owner);
        setRoomData(response.data);
        console.log(roomData)
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
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(()=>{
    if(roomData && roomData.length >0){
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
      socket.emit('chat message', { room:roomData[0].room._id, msg: message});
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
};

export default ChatRoom;