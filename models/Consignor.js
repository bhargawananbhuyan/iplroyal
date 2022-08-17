const { model, Schema } = require('mongoose')

module.exports = model(
	'Consignor',
	new Schema({
		adminRef: { type: Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
		contactNum: { type: String, required: true },
		gstNum: { type: String, required: true, unique: true },
		address: { type: String, required: true },
		createdAt: { type: Date, default: Date.now },
	})
)
