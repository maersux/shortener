import config from '../../config.js';

const headerAuth = (req, res, next) => {
	const authHeader = req.headers['Authorization'];

	if (!authHeader) {
		return res.status(401).json({ error: 'Authorization header missing' });
	}

	if (authHeader === config.admin.password) {
		return next();
	}

	return res.status(403).json({ error: 'unauthorized' });
};

export default headerAuth;
