const Promise = require('bluebird');

exports.publishToSNS = function (params, sns) {
	const publish = sns.publish(params).promise();
	return new Promise((resolve, reject) => {
		return publish
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
	});
};

exports.registerDeviceWithSNS = function (topicArn, applicationArn, deviceToken, sns) {
	console.log(`AWS Helper registering device`);
	const endpointParams = {
		PlatformApplicationArn: applicationArn, /* required */
		Token: deviceToken /* required */
	};
	const createEndpoint = sns.createPlatformEndpoint(endpointParams).promise();
	return new Promise((resolve, reject) => {
		return createEndpoint
			.then(data => {
				const subscriptionParams = {
					Protocol: 'application', /* required */
					TopicArn: topicArn, /* required */
					Endpoint: data.EndpointArn /* required */
				};
				const subscribe = sns.subscribe(subscriptionParams).promise();
				return subscribe // eslint-disable-line
			})
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
	});
};
