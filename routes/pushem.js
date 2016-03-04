const config = require('../config');

exports.sendNotification = function (req, res) {
	const body = req.body;
	const applePush = buildApplePush(body.appleMessage, body.appleLink);
	const androidPush = buildAndroidPush(body.androidMessage, body.androidLink, body.title);

	if (!body.message) {
		return res.status(400).json({message: 'No push notification supplied.'});
	}

	const message = {default: body.message};
	if (applePush) {
		message.APNS = applePush;
	}
	if (androidPush) {
		message.GCM = androidPush;
	}
	const snsParams = {
		TopicArn: config.aws.snsTopicArn,
		MessageStructure: 'json',
		Message: JSON.stringify(message)
	};
	console.log(`Sending an sns to amazon: ${JSON.stringify(message)}`);

	new req.app.get('aws').SNS().publish(snsParams, function(err, data) { // eslint-disable-line
		if (err) {
			res.status(400).json({message: err});
		} else {
			res.status(200).json({message: 'Push notification created'});
		}
	});
};

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
