const Promise = require('bluebird');

exports.publishToSNS = function (params, sns) {
	// const params = JSON.stringify(objectParams);
	console.log(`Sending an sns to amazon: ${params}`);
	return new Promise((resolve, reject) => {
		sns.publish(params, (err, data) => {
			if (err) {
				console.log(`Error sending notification to aws: ${err}`);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

exports.registerDeviceWithSNS = function (topicArn, applicationTopicArn, applicationArn, deviceToken, sns) {
	console.log(`AWS Helper registering device`);
	const endpointData = {};

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
				endpointData = data;
				// if (topicArn == null) {
				// 	resolve(data);
				// }
				const orgTopicParams = {
					Protocol: 'application', /* required */
					TopicArn: topicArn,  //eslint-disable-line
					Endpoint: endpointData.EndpointArn /* required */
				};
				sns.subscribe(orgTopicParams, function (err, data) { // eslint-disable-line
					if (err) {
						console.log('OrgTopic Subscription Failed');
						console.log(err); // an error occurred
						reject(err);
					} else {
						console.log('orgTopic Subscription Successful');
						// if (applicationTopicArn == null) {
						// 	resolve(data);
						// }
						const applicationTopicParams = {
							Protocol: 'application', /* required */
							TopicArn: applicationTopicArn,  //eslint-disable-line
							Endpoint: endpointData.EndpointArn /* required */
						};
						sns.subscribe(applicationTopicParams, function (err, data) { // eslint-disable-line
							if (err) {
								console.log('applicationTopic Subscription failed');
								console.log(err); // an error occurred
								reject(err);
							} else {
								console.log('applicationTopic Subscription Succeeded');
								console.log(data);
								resolve(data);
							}
						});
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
