const _ = require('lodash');
const router = require('express').Router(); // eslint-disable-line

module.exports = (bus, options) => {
	router.post('/register', (req, res) => {
		const topicArn 		= _.get(req, options.topicArn);
		const applicationArn = _.get(req, options.applicationArn);
		const deviceToken 	= _.get(req, options.deviceToken);
		console.log(`Router registering device with ${topicArn}, ${applicationArn}, ${deviceToken}`);
		bus.query({role: 'notifications', cmd: 'registerDevice'}, {topicArn, applicationArn, deviceToken})
			.then(device => {
				res.send(device);
			});
	});

	router.post('/notify', (req, res) => {
		const topicArn 	= _.get(req, options.topicArn);
		const message  	= _.get(req, options.message);
		bus.query({role: 'notifications', cmd: 'sendNotification'}, {topicArn, message})
			.then(notification => {
				res.send(notification);
			});
	});

	return router;
};
