process.env.NODE_ENV = 'test';

const test = require('tape');
const sinon = require('sinon');
// const Service = require('../service.js');
const Pushem = require('../routes/pushem.js');
// const aws = require('../routes/aws-helper.js');
// const Promise = require('bluebird');
// const DeviceTokens = require('../routes/device-tokens.js');

// const testDevicePayload = {
// 	features: {
// 		notifications: {
// 			enabled: true,
// 			type: 'AWS',
// 			config: {
// 				topicArn: 'testTopicARN',
// 				applicationArns: {
// 					APPLE_IOS: 'testAppleApplicationARN',
// 					GOOGLE_ANDROID: 'testAndroidApplicationARN'
// 				}
// 			}
// 		}
// 	}
// };

const testTopicArn = 'testTopicArn';
const testNotificationMessage = {
	appleMessage: 'test apple message',
	appleLink: 'test apple link',
	androidMessage: 'test android message',
	androidLink: 'test android link',
	title: 'test android title'
};

test('Passing test', t => {
	t.ok(true, 'testing the tests');
	t.end();
});

test('send notification working as it should be', t => {
	// const stub = sinon.stub(Pushem, 'publishToSNS', (params, sns) => { // eslint-disable-line
	// 	return Promise.resolve(params);
	// });
	const stub = sinon.stub(Pushem, 'publishToSNS');
	stub.returns({TopicArn: testTopicArn});
	t.plan(1);
	// const stub = sinon.stub(Pushem, 'publishToSNS');
	// stub.onCall(0).returns(true);
	Pushem.sendNotification(testTopicArn, testNotificationMessage, null)
		.then(notification => {
			t.ok(notification.TopicArn === testTopicArn, 'topic arn processed correctly');
			// t.assert(notification.Message == testNotificationMessage);
			stub.restore();
			t.end();
		});
});

// test('register device working as it should be', t => {
// 	const stub = sinon.stub(DeviceTokens, 'createPlatformEndpoint');
// 	const sentPayload = stub.returns({

// 	});
// 	t.plan(1);
// 	//would rather pass this into the service... but whatever
// 	DeviceTokens.createPlatformEndpoint()
// 		.then(device => {
// 			t.assert(device == 0);
// 		});
// });
