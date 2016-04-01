require('dotenv').config({silent: true});

module.exports = {
	main: {
		port: process.env.PORT
	},
	aws: {
		credentials: {
			region: process.env.AWS_DEFAULT_REGION,
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	},
	redis: {
		uri: process.env.REDIS_URI
	}
};
