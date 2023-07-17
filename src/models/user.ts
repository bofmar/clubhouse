import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser {
	_id: string;
	username: string;
	password: string;
	posts_ids: Array<string>;
}

const UserSchema = new Schema<IUser>({
	_id: String,
	username: {type: String, required: true, minlength: 2},
	password: {type: String, required: true, minlength: 6},
	posts_ids: [{type: String, default: []}]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
