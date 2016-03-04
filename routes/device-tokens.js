const config = require('../config');
const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({ // eslint-disable-line
	token: String,
	platform: String
});
const DeviceToken = mongoose.model('DeviceToken', deviceSchema);

exports.addToken = (req, res) => {
	const token = req.body.token;
	const platform = req.body.platform;
	if (token && platform) {
		const newDevice = new DeviceToken({token, platform});

		newDevice.save(err => {
			if (err) {
				res.status(400).json({message: `notification token registration failure: ${err}`});
			} else {
				createPlatformEndpoint(req)
				.then(() => {
					res.status(200).json({message: 'notification token registration successful'});
				}).catch(err => {
					res.status(400).json({message: `notification token registration failure: ${err}`});
				});
			}
		});
	} else {
		res.status(400).json({message: 'invalid request format'});
	}
};

function createPlatformEndpoint(req) {
	const token = req.body.token;
	const platform = req.body.platform;

	return new Promise((resolve, reject) => {
		const params = {
			PlatformApplicationArn: config.aws[`${platform}Arn`],
			Token: token
		};

		new req.app.get('aws').SNS().createPlatformEndpoint(params, function(err, data) { // eslint-disable-line
			if (err) {
				console.log('new platform endpoint creation failure');
				console.log(err);
				reject(err);
			} else {
				console.log('new platform endpoint creation success');
				console.log(data);
				subscripeEndpointToTopic(req, data)
					.then(subscriptionData => {
						resolve(subscriptionData);
					})
					.catch(subscriptionErr => {
						reject(subscriptionErr);
					});
			}
		});
	});
}

function subscripeEndpointToTopic(req, data) {
	console.log('Subscribing new endpoint');
	return new Promise((resolve, reject) => {
		const params = {
			Protocol: 'application', /* required */
			TopicArn: config.aws.snsTopicArn, /* required */
			Endpoint: data.EndpointArn
		};
		new req.app.get('aws').SNS().subscribe(params, function (err, data) { // eslint-disable-line
			if (err) {
				console.log('Subscription failed');
				console.log(err); // an error occurred
				reject(err);
			} else {
				console.log('Subscription succeeded');
				console.log(data);
				resolve(data);
			}
		});
	});
}
