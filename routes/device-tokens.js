const config = require('../config');
const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({ // eslint-disable-line
	token: String,
	platform: String
});
const DeviceToken = mongoose.model('DeviceToken', deviceSchema);

exports.addToken = function (req, res) {
	var newToken = req.body.token;
	var platform = req.body.platform;
	if (newToken && platform) {
		var newDevice = new DeviceToken({
			token: newToken,
			platform: platform
		});
		newDevice.save(function (err) {
			if (err) {
				res.status(400).json({message: 'notification token registration failure: ' + err});
			} else {
				createPlatformEndpoint(req)
				.then(function () {
					res.status(200).json({message: 'notification token registration successful'});
				}).catch(function (err) {
					res.status(400).json({message: 'notification token registration failure: ' + err});
				});
			}
		});
	} else {
		res.status(400).json({message: 'invalid request format'});
	}
};

function createPlatformEndpoint(req) {
	var token = req.body.token;
	var platform = req.body.platform;
	var applicationArn = null;
	if (platform === 'apple') {
		applicationArn = config.aws.appleArn;
		console.log('Apple device registering');
	} else if (platform === 'android') {
		applicationArn = config.aws.androidArn;
		console.log('Android device registering');
	}

	return new Promise(function (resolve, reject) {
		const params = {
			PlatformApplicationArn: applicationArn, /* required */
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
					.then(function (subscriptionData) {
						resolve(subscriptionData);
					})
					.catch(function (subscriptionErr) {
						reject(subscriptionErr);
					});
			}
		});
	});
}

function subscripeEndpointToTopic(req, data) {
	console.log('Subscribing new endpoint');
	return new Promise(function (resolve, reject) {
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
