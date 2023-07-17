import mongoose, { Types } from 'mongoose';
import User from './user';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

export interface IPost {
	_id: string;
	title: string;
	body: string;
	date_created: Date;
	user: Types.ObjectId;
}

const PostSchema = new Schema<IPost>({
	_id: String,
	title: {type: String, required: true, minlength: 3},
	body: {type: String, required: true, minlength: 4},
	date_created: {type: Date, default: Date.now},
	user: {type: Schema.Types.ObjectId, ref: User.modelName}
});

PostSchema.virtual('date_created_formated').get(function(): string {
	return this.date_created ? DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATE_MED) : '';
});

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;
