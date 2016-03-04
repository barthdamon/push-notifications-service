require('dotenv').config({silent: true});

module.exports = {
	main: {
		port: process.ENV.PORT
	},
	mongodb: {
		uri: process.ENV.MONGODB_URI
	},
	aws: {
		region: process.ENV.AWS_DEFAULT_REGION,
		appleArnId: process.ENV.APPLE_ARN,
		androidArnId: process.ENV.ANDROID_ARN,
		snsTopicArn: process.ENV.SNS_TOPIC_ARN
	}
};
