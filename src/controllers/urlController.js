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

export const generateShortLink = async (url, customUrl = null) => {
	if (customUrl) {
		const existingCustom = await redis.hGetAll(customUrl);
		if (existingCustom?.url) {
			throw new Error('custom url already in use');
		}

		await Promise.all([
			redis.set(`url:${url}`, customUrl),
			redis.hSet(customUrl, {
				url: url,
				createdAt: new Date().toISOString(),
				clickCount: 0
			})
		]);

		return {
			longUrl: url,
			shortUrl: `${config.website.url}/${customUrl}`,
			shortId: customUrl
		};
	}

	const existingShortId = await redis.get(`url:${url}`);
	if (existingShortId) {
		return {
			longUrl: url,
			shortUrl: `${config.website.url}/${existingShortId}`,
			shortId: existingShortId
		};
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

	return {
		longUrl: url,
		shortUrl: `${config.website.url}/${shortId}`,
		shortId: shortId
	};
};


export const shortenUrl = async (req, res) => {
	const { url, customUrl } = req.body;

	if (!url) {
		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: null,
			errorMessage: 'parameter "url" is required'
		});
	}

	try {
		const result = await generateShortLink(url, customUrl);
		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: result.shortUrl,
			errorMessage: null
		});
	} catch (err) {
		return res.render('layout', {
			title: 'url shortener',
			content: 'content/index',
			shortUrl: null,
			errorMessage: err.message || 'internal server error'
		});
	}
};

export const apiShortenUrl = async (req, res) => {
	const { url, customUrl } = req.body;

	if (!url) {
		return res.status(400).json({ error: 'parameter "url" is required' });
	}

	try {
		const result = await generateShortLink(url, customUrl);
		return res.status(201).json(result);
	} catch (err) {
		return res.status(500).json({ error: err.message || 'internal server error' });
	}
};

export const redirectUrl = async (req, res) => {
	const { id } = req.params;

	try {
		const urlData = await redis.hGetAll(id);
		if (!urlData?.url) {
			return res.render('layout', {
				title: 'not found',
				content: 'content/error',
				code: 404,
				message: 'could not find this page'
			});
		}

		await redis.hIncrBy(id, 'clickCount', 1);

		return res.redirect(302, urlData.url);
	} catch (err) {
		console.error('error fetching from redis:', err);
		return res.status(500).render('layout', {
			title: 'internal server error',
			content: 'content/error',
			code: 500,
			message: 'uhm, something went wrong on our side'
		});
	}
};
