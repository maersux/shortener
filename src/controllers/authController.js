import config from '../../config.js';

export const renderAuthPage = (req, res) => {
	res.render('layout', {
		title: 'authenticate',
		content: 'content/authenticate',
		errorMessage: null
	});
};

export const handleAuth = (req, res) => {
	const { authKey } = req.body;

	if (authKey === config.admin.password) {
		req.session.isAuthenticated = true;
		return res.redirect('/');
	}

	res.render('layout', {
		title: 'authenticate',
		content: 'content/authenticate',
		errorMessage: 'invalid authorization key.'
	});
};
