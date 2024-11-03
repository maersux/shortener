import app from './src/app.js';
import config from './config.js';

const { url, port } = config.website;

app.listen(port, () => {
	console.log(`server is running on ${url}:${port}`);
});
