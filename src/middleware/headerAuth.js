import config from '../../config.js';

const headerAuth = (req, res, next) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		return res.status(401).json({ error: 'authorization header missing' });
	}

	if (authHeader === config.admin.password) {
		return next();
	}

	return res.status(403).json({ error: 'unauthorized' });
};

export default headerAuth;
