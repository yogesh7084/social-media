import ChatModel from '../Models/ChatModel.js'


//creating new chat
export const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

//finding chats of current user
export const userChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).json(chats)

    } catch (error) {

    }
}

//finding perticular chats between two users 
export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: { $all: [req.params.firstId, req.params.secondId] }
        });
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error);
    }
}
