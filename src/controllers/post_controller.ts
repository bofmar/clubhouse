import express from 'express';
import User from '../models/user.js';
import Post from '../models/post.js';
import { body, validationResult } from 'express-validator';

export const create_post = [body('title').trim().isLength({min: 3}).escape(),
	body('body').trim().isLength({min: 4}).escape(),
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req);

		if(!res.locals.currentUser) {
			res.redirect('/login');
			return
		}
		const user = await User.findById(res.locals.currentUser._id);

		const post = new Post({
			title: req.body.title,
			body: req.body.body,
			user: user
		});

		if(!errors.isEmpty() || !user) {
			res.render('/create-post', {
				page: 'Crerate Post',
				post: post,
				errors: errors.array(),
			});
			return;
		} else {
			const newPost = await post.save();
			await User.findByIdAndUpdate(user._id, { $push: { posts: newPost._id}});
			res.redirect('/');
		}
}];
