'use strict';

let AWS = require('aws-sdk');

function buildApplePush(appleMessage, appleLink){
	if (!appleMessage) {
		return null;
	}
	
	return JSON.stringify({
		aps: {alert: appleMessage},
		link: (appleLink || 'collectionIdHere')
	});
}

function buildAndroidPush(androidMessage, androidLink, title){
	if (!androidMessage) {
		return null;
	}

	let result = {data: {message: androidMessage}};
	if (androidLink) {
		result.data.url = androidLink;
	}
	if (title) {
		result.data.title = title;
	}
	return JSON.stringify(result);
}

exports.sendNotification = function(req, res) {
	let body        = req.body;
	let applePush   = buildApplePush(body.appleMessage, body.appleLink);
	let androidPush = buildAndroidPush(body.androidMessage, body.androidLink, body.title);

	if (!body.message) {
		return res.status(400).json({message: 'No push notification supplied.'});
	}

	let message = {default: body.message};
	if (applePush) {
		message.APNS = applePush;
	}
	if (androidPush) {
		message.GCM = androidPush;
	}
	let snsParams = {
		TopicArn: process.env.SNS_TOPIC_ARN,
		MessageStructure: 'json',
		Message: JSON.stringify(message)
	}
	console.log(`Sending an sns to amazon: ${JSON.stringify(message)}`);

	new AWS.SNS().publish(snsParams, function(err, data) {
		if (err) {
			res.status(400).json({ message: err });

		} else {
			res.status(200).json({ message: "Push notification created" });
		}
	});
}
