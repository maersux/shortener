export default function sessionAuth(req, res, next) {
	if (req.session && req.session.isAuthenticated) {
		return next();
	}

	res.redirect('/authenticate');
}
