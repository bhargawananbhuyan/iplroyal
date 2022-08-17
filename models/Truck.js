const { model, Schema } = require('mongoose')

module.exports = model(
	'Truck',
	new Schema({
		adminRef: { type: Schema.Types.ObjectId, required: true },
		truckNum: { type: String, required: true, unique: true },
		numWheels: Number,
		model: { type: String, required: true },
		feet: { type: Number, required: true },
		truckType: { type: Number, required: true },
		mileage: Number,
		mfgName: { type: String, required: true },
		mfgDate: { type: Date, required: true },
		tonnage: { type: Number, required: true },
		createdAt: { type: Date, default: Date.now },
	})
)
