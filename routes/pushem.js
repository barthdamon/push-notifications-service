const Promise = require('bluebird');

// const aws = require('./aws-helper.js');

exports.sendNotification = (topicArn, message, sns) => {
	return new Promise((resolve, reject) => {
		const applePush	= buildApplePush(message.appleMessage, message.appleLink);
		const androidPush = buildAndroidPush(message.androidMessage, message.androidLink, message.title);

		if (!applePush && !androidPush) {
			reject();
		}

		const finalMessage = {default: message};
		if (applePush) {
			finalMessage.APNS = applePush;
		}
		if (androidPush) {
			finalMessage.GCM = androidPush;
		}

		const snsParams = {
			TopicArn: topicArn,
			MessageStructure: 'json',
			Message: JSON.stringify(finalMessage)
		};
		console.log(`Sending an sns to amazon: ${JSON.stringify(finalMessage)}`);
		console.log(sns);
		// return resolve(snsParams);
		publishToSNS(snsParams, sns)
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
		// publishToSNS(snsParams, (err, data) => {
		// 	if (err) {
		// 		return reject(err);
		// 	} else { // eslint-disable-line
		// 		return resolve(data);
		// 	}
		// });
	});
};

// function publishToSNS(params, callback) {
// 	new req.app.get('aws').SNS().publish(params, (err, data) => { // eslint-disable-line
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, data);
// 		}
// 	});
// }
function publishToSNS(params, sns) {
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
}
exports.publishToSNS = publishToSNS;

// Formatting Helpers
function buildApplePush(appleMessage, appleLink) {
	if (!appleMessage) {
		return null;
	}

	return JSON.stringify({
		aps: {alert: appleMessage},
		link: (appleLink || 'collectionIdHere')
	});
}

function buildAndroidPush(androidMessage, androidLink, title) {
	if (!androidMessage) {
		return null;
	}

	const result = {data: {message: androidMessage}};
	if (androidLink) {
		result.data.url = androidLink;
	}
	if (title) {
		result.data.title = title;
	}
	return JSON.stringify(result);
}
