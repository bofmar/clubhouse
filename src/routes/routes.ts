import express from 'express';

const router = express.Router();

import * as user_controller from '../controllers/user_controller.js';

router.get('/', (_req: express.Request, res: express.Response) => {
	res.render('index', { user: res.locals.currentUser, page: 'Home' });
});
// TODO delete
router.get('/nope', (req: express.Request, res: express.Response) => {
	res.render('nope', { user: req.user, page: 'Home' });
});

// SIGN UP
router.get('/sign-up', (_req: express.Request, res: express.Response) => res.render('sign-up-form'));
router.post('/sign-up', user_controller.sign_up_user);

// LOG IN
router.get('/log-in', (_req: express.Request, res: express.Response) => res.render('log-in-form'));
router.post('/log-in', user_controller.log_in_user);

// LOG OUT
router.get('/log-out', user_controller.log_out_user);

export default router;
