const Promise = require('bluebird');

exports.publishToSNS = function (params, sns) {
	const publish = Promise.promisify(sns.publish);
	return new Promise((resolve, reject) => {
		return publish(params)
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
	const endpointParams = {
		PlatformApplicationArn: applicationArn, /* required */
		Token: deviceToken /* required */
	};

	const newEndpoint = Promise.promisify(sns.createPlatformEndpoint);
	const subscribe = Promise.promisify(sns.subscribe);

	return new Promise((resolve, reject) => {
		return newEndpoint(endpointParams)
			.then(data => {
				const subscriptionParams = {
					Protocol: 'application', /* required */
					TopicArn: topicArn, /* required */
					Endpoint: data.EndpointArn /* required */
				};
				return subscribe(subscriptionParams) //eslint-disable-line
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
