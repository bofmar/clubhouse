import express from 'express';

export const protected_route = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
	if(!res.locals.currentUser) {
		res.redirect('/log-in');
		return
	}
	next();
}
