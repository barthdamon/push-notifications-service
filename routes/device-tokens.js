// module.exports = {
// 	registerDevice: (req, res) => {
// 		const topicArn 		= req.body.topicArn;
// 		const applicationArn = req.body.applicationArn;
// 		const deviceToken 	= req.body.deviceToken;

// 		if (topicArn && applicationArn && deviceToken) {
// 			createPlatformEndpoint(topicArn, applicationArn, deviceToken)
// 				.then(() => {
// 					res.status(200).json({message: 'notification token registration successful'});
// 				}).catch(err => {
// 					res.status(400).json({message: `notification token registration failure: ${err}`});
// 				})
// 			.done();
// 		} else {
// 			res.status(400).json({message: 'invalid request format'});
// 		}
// 	}
// };

exports.createPlatformEndpoint = (topicArn, applicationArn, deviceToken) => {
	return new Promise((resolve, reject) => {
		const params = {
			PlatformApplicationArn: applicationArn, /* required */
			Token: deviceToken /* required */
		};
		new req.app.get('aws').SNS().createPlatformEndpoint(params, function(err, data) { // eslint-disable-line
			if (err) {
				console.log('new platform endpoint creation failure');
				console.log(err);
				reject(err);
			} else {
				console.log('new platform endpoint creation success');
				console.log(data);
				const params = {
					Protocol: 'application', /* required */
					TopicArn: topicArn, /* required */
					Endpoint: data.EndpointArn /* required */
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
			}
		});
	});
};
