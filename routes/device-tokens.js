const Promise = require('bluebird');
const AWSHelper = require('./aws-helper.js'); // eslint-disable-line

exports.createPlatformEndpoint = (topicArn, applicationArn, deviceToken, sns) => { // eslint-disable-line
	console.log(`Device Token registering Device`);
	return new Promise((resolve, reject) => { // eslint-disable-line
		// resolve(true);
		return AWSHelper.registerDeviceWithSNS(topicArn, applicationArn, deviceToken, sns)
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
		// const endpointParams = {
		// 	PlatformApplicationArn: applicationArn, /* required */
		// 	Token: deviceToken /* required */
		// };
		// sns.createPlatformEndpoint(endpointParams, function(err, data) { // eslint-disable-line
		// 	if (err) {
		// 		console.log('new platform endpoint creation failure');
		// 		console.log(err);
		// 		reject(err);
		// 	} else {
		// 		console.log('new platform endpoint creation success');
		// 		console.log(data);
		// 		const params = {
		// 			Protocol: 'application', /* required */
		// 			TopicArn: topicArn,  //eslint-disable-line
		// 			Endpoint: data.EndpointArn /* required */
		// 		};
		// 		sns.subscribe(params, function (err, data) { // eslint-disable-line
		// 			if (err) {
		// 				console.log('Subscription failed');
		// 				console.log(err); // an error occurred
		// 				reject(err);
		// 			} else {
		// 				console.log('Subscription succeeded');
		// 				console.log(data);
		// 				resolve(data);
		// 			}
		// 		});
		// 	}
		// });
	});
};
// 		sns.createPlatformEndpoint(params, function(err, data) { // eslint-disable-line
// 			if (err) {
// 				console.log('new platform endpoint creation failure');
// 				console.log(err);
// 				reject(err);
// 			} else {
// 				console.log('new platform endpoint creation success');
// 				console.log(data);
// 				const params = {
// 					Protocol: 'application', /* required */
// 					TopicArn: topicArn,  required  //eslint-disable-line
// 					Endpoint: data.EndpointArn /* required */
// 				};
// 				sns.subscribe(params, function (err, data) { // eslint-disable-line
// 					if (err) {
// 						console.log('Subscription failed');
// 						console.log(err); // an error occurred
// 						reject(err);
// 					} else {
// 						console.log('Subscription succeeded');
// 						console.log(data);
// 						resolve(data);
// 					}
// 				});
// 			}
// 		});
// 	});
// };
