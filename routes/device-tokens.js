const Promise = require('bluebird');
const AWSHelper = require('./aws-helper.js'); // eslint-disable-line

exports.createPlatformEndpoint = (topicArn, applicationArn, deviceToken, sns) => { // eslint-disable-line
	console.log(`Device Token registering Device`);
	return new Promise((resolve, reject) => { // eslint-disable-line
		return AWSHelper.registerDeviceWithSNS(topicArn, applicationArn, deviceToken, sns)
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
	});
};
