import mongoose, { Schema, Document } from "mongoose"

export interface IConnection extends Document {
    users: Schema.Types.ObjectId,
    created_at: Schema.Types.Date,
}

const connectionSchema = new Schema<IConnection>({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    created_at: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


const Connection = mongoose.model<IConnection>('Connection', connectionSchema)

export default Connection
