import express from 'express';
import path from 'path';
import session from 'express-session';
import config from '../config.js';
import sessionAuth from './middleware/sessionAuth.js';
import headerAuth from './middleware/headerAuth.js';

import { renderHomePage } from './controllers/homeController.js';
import { renderAuthPage, handleAuth } from './controllers/authController.js';
import { shortenUrl, apiShortenUrl, redirectUrl } from './controllers/urlController.js';

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src/views'));

app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}));

app.get('/', sessionAuth, renderHomePage);
app.post('/', sessionAuth, shortenUrl);

app.get('/authenticate', renderAuthPage);
app.post('/authenticate', handleAuth);

app.post('/api/shorten', headerAuth, apiShortenUrl);

app.get('/:id', redirectUrl);

export default app;
