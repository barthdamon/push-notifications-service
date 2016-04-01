// const cryo = require('cryo');
const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis);

const DeviceRegistration = require('./routes/device-tokens.js');
const Pushem = require('./routes/pushem.js');
// const PlatformApplication = require('./routes/application.js');

const ROLE = 'notifications';

exports.initialize = (bus, options) => {
	console.log('Notification Service Initialized');
	const aws = options.aws;
	const SNS = new aws.SNS(); //eslint-disable-line
	const sns = Promise.promisifyAll(SNS);

	bus.queryHandler({role: ROLE, cmd: 'registerDevice'}, payload => {
		const deviceToken 			= payload.deviceToken;
		const topicArn 				= payload.topicArn; // eslint-disable-line
		const applicationArn 		= payload.applicationArn;

		console.log(`Service adding device to ${applicationArn}, with device code: ${deviceToken}`);
		return DeviceRegistration.createPlatformEndpoint(topicArn, applicationArn, deviceToken, sns)
			.then(device => {
				return device;
			});
	});

	bus.queryHandler({role: ROLE, cmd: 'sendNotification'}, payload => {
		const topicArn 				= payload.topicArn;
		const message					= payload.message;

		return Pushem.sendNotification(topicArn, message, sns)
			.then(notification => {
				return notification;
			});
	});
};

// exports.middleware = require('./middleware');
exports.router = require('./routes/router.js');
