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
