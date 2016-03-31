const _ = require('lodash');
const router = require('express').Router(); // eslint-disable-line

module.exports = (bus, options) => {
	// console.log(options);
	router.post('/register', (req, res) => {
		const topicArn 		= _.get(options.topicArn);
		const applicationArn = _.get(options.applicationArn);
		const deviceToken 	= _.get(options.deviceToken);

		bus.query({role: 'notifications', cmd: 'registerDevice'}, {topicArn, applicationArn, deviceToken})
			.then(device => {
				res.send(device);
			});
	});

	router.post('/send', (req, res) => {
		const topicArn 	= _.get(options.topicArn);
		const message  	= _.get(options.message);
		bus.query({role: 'notifications', cmd: 'sendNotification'}, {topicArn, message})
			.then(notification => {
				res.send(notification);
			});
	});

	return router;
};
