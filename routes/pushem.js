const Promise = require('bluebird');
const AWSHelper = require('./aws-helper.js');

exports.sendNotification = (topicArn, message, sns) => {
	return new Promise((resolve, reject) => {
		const applePush	= buildApplePush(message.appleMessage, message.appleLink);
		const androidPush = buildAndroidPush(message.androidMessage, message.androidLink, message.title);

		if (!applePush && !androidPush) {
			return reject();
		}

		const finalMessage = {};
		if (applePush) {
			finalMessage.APNS = applePush;
			console.log('Attaching apple message');
		}
		if (androidPush) {
			finalMessage.GCM = androidPush;
			console.log('Attaching android message');
		}

		const snsParams = {
			TopicArn: topicArn,
			MessageStructure: 'json',
			Message: finalMessage
		};
		console.log(`Sending an sns to amazon: ${JSON.stringify(finalMessage)}`);
		AWSHelper.publishToSNS(snsParams, sns)
			.then(data => {
				return resolve(data);
			})
			.catch(err => {
				return reject(err);
			})
		.done();
	});
};

// Formatting Helpers
function buildApplePush(appleMessage, appleLink) {
	if (!appleMessage) {
		return null;
	}

	return {
		aps: {alert: appleMessage},
		link: (appleLink || 'collectionIdHere')
	};
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
	return result;
}

// OLD CALLBACK STUFF:
		// publishToSNS(snsParams, (err, data) => {
		// 	if (err) {
		// 		return reject(err);
		// 	} else { // eslint-disable-line
		// 		return resolve(data);
		// 	}
		// });
// function publishToSNS(params, callback) {
// 	new req.app.get('aws').SNS().publish(params, (err, data) => { // eslint-disable-line
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, data);
// 		}
// 	});
// }

