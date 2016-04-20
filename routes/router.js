const _ = require('lodash');
const router = require('express').Router(); // eslint-disable-line

module.exports = (bus, options) => {
	router.post('/register', (req, res) => {
		const topicArn 		= _.get(req, options.topicArn);
		const applicationTopicArn 		= _.get(req, options.applicationTopicArn);
		const applicationArn = _.get(req, options.applicationArn);
		const deviceToken 	= _.get(req, options.deviceToken);
		console.log(`Router registering device with ${topicArn}, ${applicationTopicArn}, ${applicationArn}, ${deviceToken}`);
		bus.query({role: 'notifications', cmd: 'registerDevice'}, {topicArn, applicationTopicArn, applicationArn, deviceToken})
			.then(device => {
				res.send(device);
			});
	});

	router.post('/notify/organization', (req, res) => {
		const organizationTopicArn 	= _.get(req, options.organizationTopicArn);
		const message  	= _.get(req, options.message);
		bus.query({role: 'notifications', cmd: 'notifyOrganization'}, {organizationTopicArn, message})
			.then(notification => {
				res.send(notification);
			});
	});

	router.post('/notify/application', (req, res) => {
		const applicationTopicArn	= _.get(req, options.applicationTopicArn);
		const message  	= _.get(req, options.message);
		bus.query({role: 'notifications', cmd: 'notifyApplication'}, {applicationTopicArn, message})
			.then(notification => {
				res.send(notification);
			});
	});

	return router;
};
