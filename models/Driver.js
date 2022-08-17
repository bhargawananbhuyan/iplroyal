const { model, Schema } = require('mongoose')

module.exports = model(
	'Driver',
	new Schema({
		adminRef: { type: Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
		dateOfJoining: { type: Date, required: true },
		contactNum: { type: String, required: true },
		altContactNum: String,
		familyContactNum: String,
		permanentAddress: { type: String, required: true },
		temporaryAddress: { type: String, required: true },
		licenseNum: { type: String, required: true },
		licenseDocID: { type: String, required: true },
		licenseDocURL: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
	})
)
