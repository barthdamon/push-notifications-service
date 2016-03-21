const config = require('../config');
const mongoose = require('mongoose');
const OrganizationTopic = require('./topics.js');
const PlatformApplication = require('./application.js');

const deviceSchema = mongoose.Schema({ // eslint-disable-line
	token: String,
	platform: String,
	organization: String
});
const DeviceToken = mongoose.model('DeviceToken', deviceSchema);

module.exports = {

	addToken: (req, res) => {
		const token = req.body.token;
		const platform = req.body.platform;
		const organization = req.body.organization;

		if (token && platform) {
			const newDevice = new DeviceToken({token, platform, organization});

			newDevice.save(err => {
				if (err) {
					res.status(400).json({message: `notification token registration failure: ${err}`});
				} else {
					createPlatformEndpoint(req)
					.then(() => {
						res.status(200).json({message: 'notification token registration successful'});
					}).catch(err => {
						res.status(400).json({message: `notification token registration failure: ${err}`});
					});
				}
			});
		} else {
			res.status(400).json({message: 'invalid request format'});
		}
	}
};

function createPlatformEndpoint(req) {
	const token = req.body.token;
	const platform = req.body.platform;
	// TODO: get orgId
	const orgId = req.orgId;

	return new Promise((resolve, reject) => {
		// TODO: get the platform Application Arn from the database
		PlatformApplication.getPlatformApplicationARN(req.orgId)
			.then(application => {
				const ARN = application.ARN;
				console.log(`ARN: ${ARN}`);
				// TODO: Promisify and plug in the ARN
				const params = {
					PlatformApplicationArn: config.aws[`${platform}Arn`],
					Token: token
				};

				new req.app.get('aws').SNS().createPlatformEndpoint(params, function(err, data) { // eslint-disable-line
					if (err) {
						console.log('new platform endpoint creation failure');
						console.log(err);
						reject(err);
					} else {
						console.log('new platform endpoint creation success');
						console.log(data);
						OrganizationTopic.subscripeEndpointToTopic(req, data, orgId)
							.then(subscriptionData => {
								resolve(subscriptionData);
							})
							.catch(subscriptionErr => {
								reject(subscriptionErr);
							});
					}
				});
			})
			.catch(err => {
				reject(err);
			})
		.done();
	});
}
