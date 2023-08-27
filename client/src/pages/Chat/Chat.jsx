import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useSelector } from 'react-redux'
import { userChats } from '../../api/ChatRequests';
import NavIcons from '../../components/NavIcons/NavIcons'
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import Conversation from '../../components/Conversation/Conversation';
import ChatBox from '../../components/ChatBox/ChatBox';

const Chat = () => {

  const { user } = useSelector((state) => state.authReducer.authData);
  const [chats, setChats] = useState([]);
  const [currenChat, setCurrentChat] = useState(null);

  console.log(user);

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
                <Conversation data={chat} currentUserId={user._id} />
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

        <ChatBox chat={currenChat} currentUser={user._id} />

      </div>
    </div>
  )
}

export default Chat