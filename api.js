require('dotenv').config({silent: true});

const oddcast = require('oddcast');
const express = require('express');

const service = require('./service');
const AWS = require('aws-sdk');

const bus = oddcast.bus();
const api = express();

bus.requests.use({}, oddcast.inprocessTransport());

service.initialize(bus, {
	aws: AWS
});

api.use(service.router(bus, {
	organizationTopicArn: 'body.organizationTopicArn',
	applicationTopicArn: 'body.applicationTopicArn',
	applicationArn: 'body.applicationArn',
	deviceToken: 'body.deviceToken',
	message: 'body.message'
}));

if (!module.parent) {
	api.listen(process.env.PORT, err => {
		if (err) {
			console.log(`Notification API launch failure ${err}`);
		} else {
			console.log(`Notification API running on port ${process.env.PORT}`);
		}
	});
}
module.exports = api;
