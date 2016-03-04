require('dotenv').config({silent: true});

module.exports = {
	main: {
		port: process.env.PORT
	},
	mongodb: {
		uri: process.env.MONGODB_URI
	},
	aws: {
		region: process.env.AWS_DEFAULT_REGION,
		appleArnId: process.env.APPLE_ARN,
		androidArnId: process.env.ANDROID_ARN,
		snsTopicArn: process.env.SNS_TOPIC_ARN
	}
};
