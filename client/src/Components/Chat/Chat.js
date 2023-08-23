import { useEffect, useState } from "react"
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")

function Chat() {
    const [message, setMessage] = useState("")
    const [messageReceived, setMessageReceived] = useState("")

    const sendMessage = () => {
        socket.emit("send_message", { message })
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message)
        });
    }, [socket]);

    return(
        <div>
            <input onChange={(e) => setMessage(e.target.value)} placeholder="Type Here"/>
            <button onClick={sendMessage}>Send Message</button>
            <h1>Messages</h1>
            {messageReceived}
        </div>
    )
}

export default Chat