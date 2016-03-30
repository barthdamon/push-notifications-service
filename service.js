// const cryo = require('cryo');
const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis);

const DeviceRegistration = require('./routes/device-tokens.js');
const Pushem = require('./routes/pushem.js');
// const PlatformApplication = require('./routes/application.js');

const ROLE = 'notifications';

exports.initialize = (bus, options) => {
	console.log(options);
	const aws = options.aws;
	const sns = Promise.promisifyAll(new aws.SNS());

	bus.queryHandler({role: ROLE, cmd: 'registerDevice'}, payload => {
		const platform 				= payload.platform;
		const deviceCode 				= payload.deviceCode;
		const notificationConfig	= payload.identity.organization.features.notifications.config;
		const topicArn 				= notificationConfig.topicArn;
		const activeArn 				= notificationConfig.applicationArns[`${platform}`];

		if (activeArn && topicArn) {
			console.log(`Adding device to ${activeArn}`);
			return DeviceRegistration.createPlatformEndpoint(topicArn, activeArn, deviceCode, sns)
				.then(device => {
					return device;
				});
		}
	});

	bus.queryHandler({role: ROLE, cmd: 'sendNotification'}, payload => {
		const notificationConfig 	= payload.identity.organization.features.notifications.config;
		const topicArn 				= notificationConfig.topicArn;
		const message					= payload.message;

		Pushem.sendNotification(topicArn, message, sns)
			.then(notification => {
				return notification;
			});
	});
};

// exports.middleware = require('./middleware');
exports.router = require('./routes/router.js');
