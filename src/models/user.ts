import mongoose, { Schema, Document } from "mongoose"
import bcrypt from 'bcrypt'
import validator from 'validator'

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    confirm_password: string,
    created_at: Schema.Types.Date,
    avatar?: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        trim: true,
        required: [true, 'User must provide name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    confirm_password: {
        type: String,
        required: [true, 'Please confirm your password'],
        // Only works on create and save
        validate: {
            validator: function (el: string): boolean {
                return el === this.password
            },
            message: 'Password are not the same !!!'
        },
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 8)
    this.confirm_password = undefined
    next()
})

userSchema.methods.correctPassword = async function (candidatePwd: string, userPwd: string): Promise<boolean> {
    return await bcrypt.compare(candidatePwd, userPwd)
}

const User = mongoose.model<IUser>('User', userSchema)

export default User
