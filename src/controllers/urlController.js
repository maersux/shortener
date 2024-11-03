import redis from '../services/redis.js';
import config from '../../config.js';

const generateShortId = (length = 8) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

export const shortenUrl = async (req, res) => {
	const { url } = req.body;

	if (!url) {
		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: null,
			errorMessage: 'parameter "url" is required'
		});
	}

	try {
		const existingShortId = await redis.get(`url:${url}`);
		if (existingShortId) {
			return res.render('layout', {
				title: 'url shortener',
				content: 'content/index',
				shortUrl: `${config.website.url}/${existingShortId}`,
				errorMessage: null
			});
		}

		const shortId = generateShortId();

		await Promise.all([
			redis.set(`url:${url}`, shortId),
			redis.hSet(shortId, {
				url: url,
				createdAt: new Date().toISOString(),
				clickCount: 0
			})
		]);

		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: `${config.website.url}/${shortId}`,
			errorMessage: null
		});
	} catch (err) {
		console.error('error handling the url:', err);
		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: null,
			errorMessage: 'internal server error'
		});
	}
};

export const redirectUrl = async (req, res) => {
	const { id } = req.params;

	try {
		const urlData = await redis.hGetAll(id);
		if (!urlData?.url) {
			return res.status(404).send('<h1>404 - url not found</h1>');
		}

		await redis.hIncrBy(id, 'clickCount', 1);

		return res.redirect(302, urlData.url);
	} catch (err) {
		console.error('error fetching from redis:', err);
		return res.status(500).send('<h1>500 - internal server error</h1>');
	}
};
