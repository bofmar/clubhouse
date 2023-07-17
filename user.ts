import mongoose, { Types } from "mongoose";
import Post from "./post";

const Schema = mongoose.Schema;

export interface IUser {
	_id: string;
	username: string;
	password: string;
	posts: Array<Types.ObjectId>;
}

const UserSchema = new Schema<IUser>({
	_id: String,
	username: {type: String, required: true, minlength: 2},
	password: {type: String, required: true, minlength: 6},
	posts: [{type: Schema.Types.ObjectId, ref: Post.modelName}]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
