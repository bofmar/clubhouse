import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

export const sign_up_user = [
	body('username', 'Invalid Username - Username must be at least 2 characters long')
		.trim()
		.isLength({min: 2})
		.escape(),
	body('password', 'Invalid password - Passwords must be at leaset 6 characters long, and contain both letters and numbers but no special characters')
		.trim()
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
	,async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			bcrypt.hash(req.body.password, 10, async(error, hashedPassword) => {
				if(error) {
					console.log(error);
					res.status(400).redirect('/');
				}

				const validationErrors = validationResult(req);

				const userExist = await User.findOne({username: req.body.username});
				if(userExist) {
					res.render('sign-up-form', {
						page: 'Sign Up',
						user: {username: req.body.username},
						errors: [{msg: 'Invalid Username - Someone is already using this username. Please choose another.'}],
					});
					return;
				}

				if(!validationErrors.isEmpty()) {
					res.render('sign-up-form', {
						page: 'Sign Up',
						user: {username: req.body.username},
						errors: validationErrors.array(),
					});
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
	} 
];

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
