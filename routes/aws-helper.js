// const Promise = require('bluebird');

// exports.publishToSNS = (params, sns) => {
// 	const publish = Promise.promisify(sns.publish);
// 	return new Promise((resolve, reject) => {
// 		return publish(params)
// 			.then(data => {
// 				return resolve(data);
// 			})
// 			.catch(err => {
// 				return reject(err);
// 			})
// 		.done();
// 	});
// };
