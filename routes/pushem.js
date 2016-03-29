exports.sendNotification = (topicArn, message) => {
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
		console.log(`Sending an sns to amazon: ${JSON.stringify(message)}`);

		new req.app.get('aws').SNS().publish(snsParams, (err, data) => { // eslint-disable-line
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

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
