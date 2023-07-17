import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import url from 'url';

dotenv.config();

const PORT = process.env.PORT || 5000;
const PASSPHRASE = process.env.SECRET_MESSAGE;
const MONGO_URI = process.env.MONGO_URI;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const app = express();

// Connect to mongo and listen for requests
mongoose.connect(MONGO_URI as string).then(_result => {
	app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
}).catch(error => {
	console.log(error);
});

app.set('views', path.join(ROOT, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(ROOT, 'public')));

app.get('/', (_req: express.Request, res: express.Response) => {
	res.render('index', { msg: PASSPHRASE, page: 'Home' });
});
