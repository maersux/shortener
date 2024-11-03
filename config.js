import dotenv from 'dotenv';

dotenv.config();

const config = {
	sessionSecret: process.env.SESSION_SECRET,
	website: {
		url: process.env.URL,
		port: process.env.PORT
	},
	admin: {
		user: process.env.ADMIN_USER,
		password: process.env.ADMIN_PASSWORD
	}
};

export default config;