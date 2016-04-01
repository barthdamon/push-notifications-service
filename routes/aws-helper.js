const Promise = require('bluebird');

exports.publishToSNS = function (params, sns) {
	return new Promise((resolve, reject) => {
		sns.publish(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

exports.registerDeviceWithSNS = function (topicArn, applicationArn, deviceToken, sns) {
	console.log(`AWS Helper registering device`);
	return new Promise((resolve, reject) => {
		const endpointParams = {
			PlatformApplicationArn: applicationArn, /* required */
			Token: deviceToken /* required */
		};
		sns.createPlatformEndpoint(endpointParams, function(err, data) { // eslint-disable-line
			if (err) {
				console.log('new platform endpoint creation failure');
				console.log(err);
				reject(err);
			} else {
				console.log('new platform endpoint creation success');
				console.log(data);
				const params = {
					Protocol: 'application', /* required */
					TopicArn: topicArn,  //eslint-disable-line
					Endpoint: data.EndpointArn /* required */
				};
				sns.subscribe(params, function (err, data) { // eslint-disable-line
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

// PROMISIFIED AWS CALLS (Not working)
	// const endpointParams = {
	// 	PlatformApplicationArn: applicationArn, /* required */
	// 	Token: deviceToken /* required */
	// };
	// const createEndpoint = sns.createPlatformEndpoint(endpointParams).promise();
	// return new Promise((resolve, reject) => {
	// 	return createEndpoint
	// 		.then(data => {
	// 			const subscriptionParams = {
	// 				Protocol: 'application', /* required */
	// 				TopicArn: topicArn, /* required */
	// 				Endpoint: data.EndpointArn /* required */
	// 			};
	// 			const subscribe = sns.subscribe(subscriptionParams).promise();
	// 			return subscribe // eslint-disable-line
	// 		})
	// 		.then(data => {
	// 			return resolve(data);
	// 		})
	// 		.catch(err => {
	// 			return reject(err);
	// 		})
	// 	.done();
	// });

	// 	const publish = sns.publish(params).promise();
	// return new Promise((resolve, reject) => {
	// 	return publish
	// 		.then(data => {
	// 			return resolve(data);
	// 		})
	// 		.catch(err => {
	// 			return reject(err);
	// 		})
	// 	.done();
	// });
