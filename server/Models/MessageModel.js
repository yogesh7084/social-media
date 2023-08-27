import mongoose, { mongo } from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true
        },

        senderId: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const MessageModel = mongoose.model("message", MessageSchema);
export default MessageModel;