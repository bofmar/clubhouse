import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import url from 'url';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';
import bcrypt from 'bcryptjs';
import session from 'express-session';

dotenv.config();

const PORT = process.env.PORT || 5000;
const PASSPHRASE = process.env.SECRET_MESSAGE;
const SECRET = process.env.SECRET;
const MONGO_URI = process.env.MONGO_URI;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Passport initialization
passport.use(
	new LocalStrategy(async(username, password, done) => {
		try {
			const user = await User.findOne({username: username});
			if(!user) {
				return done(null,false, { message: 'Incorrect username' });
			}
			bcrypt.compare(password, user.password, (_err, res) => {
				if(res) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Incorrect password' });
				}
			});
		} catch(err) {
			return done(err);
		}
	})
);

passport.serializeUser(function(user: any, done) {
	done(null, user._id);
});

passport.deserializeUser(async function(_id, done) {
	try {
		const user = await User.findById(_id);
		done(null, user);
	} catch(err) {
		done(err);
	}
});


const app = express();

// Connect to mongo and listen for requests
mongoose.connect(MONGO_URI as string).then(_result => {
	app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
}).catch(error => {
	console.log(error);
});

app.use(session({
	secret: SECRET as string,
	resave: false,
	saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(ROOT, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(ROOT, 'public')));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.locals.currentUser = req.user;
	next();
});

app.get('/', (_req: express.Request, res: express.Response) => {
	res.render('index', { user: res.locals.currentUser, msg: PASSPHRASE, page: 'Home' });
});

app.get('/nope', (req: express.Request, res: express.Response) => {
	res.render('nope', { user: req.user, msg: PASSPHRASE, page: 'Home' });
});

app.get('/sign-up', (_req: express.Request, res: express.Response) => res.render('sign-up-form'));
app.post('/sign-up', async (req: express.Request, res: express.Response, next) => {
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
});

app.get('/log-in', (_req: express.Request, res: express.Response) => res.render('log-in-form'));
app.post('/log-in', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/nope',
}));

app.get('/log-out', (req: express.Request, res: express.Response, next) => {
	req.logout(function (err) {
		if(err) {
			return next(err);
		}
		res.redirect('/');
	});
});
