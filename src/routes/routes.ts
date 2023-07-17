import express from 'express';

const router = express.Router();

import * as user_controller from '../controllers/user_controller.js';
import * as post_controller from '../controllers/post_controller.js';
import * as general_controller from '../controllers/general.js';

router.get('/', (_req: express.Request, res: express.Response) => {
	res.render('index', { user: res.locals.currentUser, page: 'Home' });
});

// SIGN UP
router.get('/sign-up', (_req: express.Request, res: express.Response) => res.render('sign-up-form', { user: res.locals.currentUser, page: 'Sign-Up'}));
router.post('/sign-up', user_controller.sign_up_user);

// LOG IN
router.get('/log-in', (_req: express.Request, res: express.Response) => res.render('log-in-form', { user: res.locals.currentUser, page: 'Log-in'}));
router.post('/log-in', user_controller.log_in_user);

// LOG OUT
router.get('/log-out', general_controller.protected_route, user_controller.log_out_user);

// POSTS ROUTES
router.get('/create-post', general_controller.protected_route, (_req: express.Request, res: express.Response) => {
	res.render('create-post-form', { page: 'New Post', user: res.locals.currentUser});
});
router.post('/create-post', general_controller.protected_route, post_controller.create_post);

export default router;
