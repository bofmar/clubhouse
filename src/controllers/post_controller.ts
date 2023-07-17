import express from 'express';
import User from '../models/user.js';
import Post from '../models/post.js';
import { body, validationResult } from 'express-validator';

export const create_post = [body('title', 'Invalid Title - Titles must be at least 3 characters long.').trim().isLength({min: 3}).escape(),
	body('body', 'Invalid Post - Posts must be at least 4 characters long.').trim().isLength({min: 4}).escape(),
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req);

		const user = await User.findById(res.locals.currentUser._id);

		const post = new Post({
			title: req.body.title,
			body: req.body.body,
			user: user
		});

		if(!errors.isEmpty() || !user) {
			res.render('create-post-form', {
				page: 'Crerate Post',
				post: post,
				errors: errors.array(),
				user: res.locals.currentUser,
			});
			return;
		} else {
			const newPost = await post.save();
			await User.findByIdAndUpdate(user._id, { $push: { posts_ids: `${newPost._id}`}});
			res.redirect('/');
		}
}]; 
