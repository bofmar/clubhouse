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

			const userExist = await User.findOne({username: req.body.username});
			if(userExist) {
				//TODO send user back to the form
				res.status(401).redirect('/');
				return;
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
} // TODO VALIDATE THE FORM. HANDLE SENDING USERS BACK TO THE FORM

export const log_in_user = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/log-in',
});

export const log_out_user = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	req.logout(function (err) {
		if(err) {
			return next(err);
		}
		res.redirect('/');
	});
}
