import React, { useEffect, useRef, useState } from 'react'
import './Chat.css'
import { useSelector } from 'react-redux'
import { userChats } from '../../api/ChatRequests';
import NavIcons from '../../components/NavIcons/NavIcons'
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import Conversation from '../../components/Conversation/Conversation';
import ChatBox from '../../components/ChatBox/ChatBox';
import { io } from 'socket.io-client';

const Chat = () => {

  const { user } = useSelector((state) => state.authReducer.authData);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:8000");
    socket.current.emit("new-user-add", user._id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users);
    })
  }, [user])

  // send to socket server 
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage)
    }
  }, [sendMessage])


  // receive from socket server 
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
    })
  }, [])

  // console.log(user);

  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await userChats(user._id);
        console.log(data);
        setChats(data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getChats();
  }, [user])

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember)
    return online ? true : false
  }

  return (
    <div className="Chat">

      {/* left side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">


          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) =>
              <div onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={user._id} online={checkOnlineStatus(chat)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side  */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>

        <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receivedMessage={receivedMessage} />

      </div>
    </div>
  )
}

export default Chat