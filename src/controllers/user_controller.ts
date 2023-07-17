import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import passport from 'passport';

export const sign_up_user = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		bcrypt.hash(req.body.password, 10, async(error, hashedPassword) => {
			if(error) {
				console.log(error);
				res.status(400).redirect('/');
			}

			const user = new User({
				username: req.body.username,
				password: hashedPassword
			});
			await user.save();
			res.status(200).redirect('/');
		});
	} catch(err) {
		return next(err);
	}
}

export const log_in_user = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/nope',
});

export const log_out_user = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	req.logout(function (err) {
		if(err) {
			return next(err);
		}
		res.redirect('/');
	});
}
