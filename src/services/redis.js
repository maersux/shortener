import { createClient } from 'redis';

const redis = createClient({
	url: 'redis://redis:6379'
});

redis.on('connect', () => {
	console.log('connected to redis');
});

redis.on('error', (err) => {
	console.error('redis error:', err);
});

await redis.connect();

export default redis;
