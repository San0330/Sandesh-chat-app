import mongoose, { Schema, Document } from "mongoose"

export interface IChat extends Document {
    connectionId: Schema.Types.ObjectId,
    message: string,
    senderId: Schema.Types.ObjectId,
    created_at: Schema.Types.Date,
}

const chatSchema = new Schema<IChat>({
    connectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Connection'
    },
    message: {
        type: String,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Chat = mongoose.model<IChat>('Chat', chatSchema)

export default Chat
