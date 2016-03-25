const mongoose = require('mongoose');
const config = require('../config');

const organizationTopicSchema = mongoose.Schema({ // eslint-disable-line
	name: String,
	topicArn: String
});
const OrganizationTopic = mongoose.model('OrganizationTopic', organizationTopicSchema);

module.exports = {
	// Potential CLI route
	createOrganizationTopic: (req, res) => {
		const name = req.body.orgId;
		const params = {
			name
		};
		new req.app.get('aws').SNS().createTopic(params, (err, data) => { // eslint-disable-line
			if (err) {
				res.status(400).json({message: `organization topic creation failure ${err}`});
			} else {
				const arn = data.arn;
				const name = data.orgId;
				const newOrganization = new OrganizationTopic({name, arn});
				newOrganization.save(err => {
					if (err) {
						res.status(400).json({message: `organization topic creation failure ${err}`});
					} else {
						res.status(200).json({message: 'organization topic creation successful'});
					}
				});
			}
		});
	},
	subscripeEndpointToTopic: (req, data, orgId) => {
		console.log('Subscribing new endpoint');
		return new Promise((resolve, reject) => {
			OrganizationTopic.find({orgId}).exec()
				.then(topic => {
					const topicARN = topic.ARN;
					// TODO: use the topic arn from the server
					// Endpoint ARN here is an endpoint that just got created
					const params = {
						Protocol: 'application', /* required */
						TopicArn: topicARN, /* required */
						Endpoint: data.EndpointArn
					};
					new req.app.get('aws').SNS().subscribe(params, function (err, data) { // eslint-disable-line
						if (err) {
							console.log('Subscription failed');
							console.log(err); // an error occurred
							reject(err);
						} else {
							console.log('Subscription succeeded');
							console.log(data);
							resolve(data);
						}
					});
				})
				.catch(err => {
					reject(err);
				})
			.done();
		});
	}

};
