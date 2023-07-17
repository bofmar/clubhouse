import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser {
	username: string;
	password: string;
	role: 'USER' | 'ADMIN';
	posts_ids: Array<string>;
}

const UserSchema = new Schema<IUser>({
	username: {type: String, required: true, minlength: 2},
	password: {type: String, required: true, minlength: 6},
	role: {type: String, default: 'USER'},
	posts_ids: [{type: String, default: []}]
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
