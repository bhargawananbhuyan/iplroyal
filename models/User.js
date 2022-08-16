const { model, Schema } = require('mongoose')

module.exports = model(
	'User',
	new Schema({
		fullName: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		created_at: { type: Date, default: Date.now },
	})
)
