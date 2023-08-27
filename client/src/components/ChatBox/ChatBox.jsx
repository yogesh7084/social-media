import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'
import { getUser } from '../../api/UserRequest';
import { getMessages } from '../../api/MessageRequest';

const ChatBox = ({ chat, currentUser }) => {

    const [userData, setUserData] = useState(null);
    const [messages, setMessager] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const userId = chat?.members.find((id) => id !== currentUser);

        const getUserData = async () => {

            try {
                const { data } = await getUser(userId);
                console.log(data)
                setUserData(data);

            } catch (error) {
                console.log(error)
            }
        }
        if (chat !== null) getUserData();
    }, [chat, currentUser])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                console.log(data)
                setMessager(data);
            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) fetchMessages();
    }, [chat])

    const handleChange = (msg) => {
        setNewMessage(msg);
    }


    return (

        <div className="ChatBox-container">
            {chat ?
                (<>
                    <div className="chat-header">
                        <div className="follower">
                            <div className="">
                                <img
                                    src={userData?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"} alt=""
                                    className='followerImage'
                                    style={{ width: "50px", height: "50px" }}
                                />

                                <div className="name" style={{ fontSize: "0.8rem" }}>
                                    <span> {userData?.firstname} {userData?.lastname} </span>
                                </div>
                            </div>
                        </div>
                        <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                    </div>

                    {/* Chat box messages */}
                    <div className="chat-body">
                        {messages.map((message) => (
                            <>
                                <div className={message.senderId === currentUser ? "message own" : "message"}>
                                    <span>{message.text} </span>
                                    <span>{format(message.createdAt)} </span>
                                </div>
                            </>
                        ))}
                    </div>

                    <div className="chat-sender">
                        <div>+</div>
                        <InputEmoji
                            value={newMessage}
                            onChange={handleChange}
                        />
                        <div className="send-button button">Send</div>
                    </div>

                </>)
                : (
                    <span className='chatbox-empty-message'>Tap on a chat to see conversation ...</span>
                )
            }
        </div>

    )
}

export default ChatBox