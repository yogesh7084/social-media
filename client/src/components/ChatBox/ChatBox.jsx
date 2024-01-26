import React, { useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'
import { getUser } from '../../api/UserRequest';
import { addMessage, getMessages } from '../../api/MessageRequest';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const scroll = useRef();

    useEffect(() => {
        scroll.current?.scrollIntoView({ behaviour: "smooth" });
    }, [messages])

    useEffect(() => {
        if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
            setMessages([...messages, receivedMessage]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedMessage])

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
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) fetchMessages();
    }, [chat])

    const handleChange = (msg) => {
        setNewMessage(msg);
    }

    const handleSend = async (e) => {
        e.preventDefault();

        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id
        }

        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.log(error)
        }

        // send msg to socket server 
        const receiverId = chat.members.find((id) => id !== currentUser);
        setSendMessage({ ...message, receiverId })
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
                        {messages.map((message, key) => (
                            <div
                                ref={scroll}
                                className={message.senderId === currentUser ? "message own" : "message"}
                                key={key}
                            >
                                <span>{message.text} </span>
                                <span>{format(message.createdAt)} </span>
                            </div>
                        ))}
                    </div>

                    <div className="chat-sender">
                        <div>+</div>
                        <InputEmoji
                            value={newMessage}
                            onChange={handleChange}
                        />
                        <div className="send-button button" onClick={handleSend}>Send</div>
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