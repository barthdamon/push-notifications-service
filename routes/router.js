const router = require('express').Router(); // eslint-disable-line

module.exports = (bus, options) => {
	console.log(options);
	router.get('/notifications/register', (req, res) => {
		const topicArn 		= req.body.topicArn;
		const applicationArn = req.body.applicationArn;
		const deviceToken 	= req.body.deviceToken;

		bus.query({role: 'identity', cmd: 'fetchOrganization'}, {topicArn, applicationArn, deviceToken})
			.then(device => {
				res.send(device);
			});
	});

	router.get('/notifications/send', (req, res) => {
		const message  	= req.body.message;
		const topicArn 	= req.body.topicArn;
		bus.query({role: 'identity', cmd: 'fetchDevice'}, {topicArn, message})
			.then(notification => {
				res.send(notification);
			});
	});

	return router;
};
