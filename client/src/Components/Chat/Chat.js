import './Chat.css'

function Chat() {
    return(
        <div className="flex h-screen">
            <div className="bg-blue-100 w-1/3">Conversations</div>
            <div className="bg-blue-300 w-2/3">
                <div>Messages</div>
                <input type="text" ></input>
            </div>
        </div>
    )
}

export default Chat