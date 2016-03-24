const mongoose = require('mongoose');
// const config = require('../config');

const platformApplicationSchema = mongoose.Schema({ // eslint-disable-line
	platform: String,
	orgId: String,
	topicArn: String
});
const PlatformApplication = mongoose.model('PlatformApplication', platformApplicationSchema);

// TODO: have a create platform application CLI tool? or a route that can somehow do it but dont think it can

module.exports = {
	getPlatformApplicationARN: orgId => {
		return new Promise((resolve, reject) => {
			PlatformApplication.findOne({orgId}).exec()
				.then(application => {
					resolve(application);
				})
				.catch(err => {
					reject(err);
				})
			.done();
		});
	},

	// Potential CLI Route
	// createPlatformApplication: (platform, orgId, topicArn) => {

	// }
};
