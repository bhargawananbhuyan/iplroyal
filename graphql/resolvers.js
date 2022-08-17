const { GraphQLScalarType, Kind } = require('graphql')
const { AuthenticationError } = require('apollo-server-core')
const { sign } = require('jsonwebtoken')

// models
const User = require('../models/User')
const Consignor = require('../models/Consignor')
const Consignee = require('../models/Consignee')
const Truck = require('../models/Truck')

// utils
const verifyUser = require('../utils/verifyUser')
const { hashPassword, comparePassword } = require('../utils/passwordUtil')
const Driver = require('../models/Driver')

module.exports = {
	Query: {
		getConsignors: async (_, __, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				try {
					const consignors = await Consignor.find({ adminRef: payload._id })
					const adminRef = await User.findOne({ _id: payload._id })
					const returnPayload = consignors.map((c) => ({
						adminRef,
						id: c._id,
						name: c.name,
						contactNum: c.contactNum,
						gstNum: c.gstNum,
						address: c.address,
					}))
					return returnPayload
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		getConsignees: async (_, __, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				try {
					const consignees = await Consignee.find({ adminRef: payload._id })
					const adminRef = await User.findOne({ _id: payload._id })
					const returnPayload = consignees.map((c) => ({
						adminRef,
						id: c._id,
						name: c.name,
						contactNum: c.contactNum,
						gstNum: c.gstNum,
						address: c.address,
					}))
					return returnPayload
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		getTrucks: async (_, __, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				try {
					const trucks = await Truck.find({ adminRef: payload._id })
					const adminRef = await User.findOne({ _id: payload._id })
					const returnPayload = trucks.map((t) => ({
						adminRef,
						id: t._id,
						truckNum: t.truckNum,
						numWheels: t.numWheels,
						model: t.model,
						feet: t.feet,
						truckType: t.truckType,
						mileage: t.mileage,
						mfgName: t.mfgName,
						mfgDate: t.mfgDate,
						tonnage: t.tonnage,
						createdAt: t.createdAt,
					}))
					return returnPayload
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		getDrivers: async (_, __, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				try {
					const drivers = await Driver.find({ adminRef: payload._id })
					const adminRef = await User.findOne({ _id: payload._id })
					const returnPayload = drivers.map((d) => ({
						adminRef,
						id: d._id,
						name: d.name,
						dateOfJoining: d.dateOfJoining,
						contactNum: d.contactNum,
						altContactNum: d.altContactNum,
						familyContactNum: d.familyContactNum,
						permanentAddress: d.permanentAddress,
						temporaryAddress: d.temporaryAddress,
						licenseNum: d.licenseNum,
						licenseDoc: {
							id: d.licenseDocID,
							url: d.licenseDocURL,
						},
						createdAt: d.createdAt,
					}))
					return returnPayload
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},
	},

	Mutation: {
		createUser: async (_, args) => {
			const { email, password } = args
			try {
				const newUser = new User({ email, password: await hashPassword(password) })
				const savedUser = await newUser.save()
				return savedUser
			} catch (error) {
				throw new Error(error?.message)
			}
		},

		signinUser: async (_, args) => {
			const { email, password } = args
			try {
				// check if user exists
				const existingUser = await User.findOne({ email })
				if (!existingUser) throw new AuthenticationError('user not registered')

				// check if password is correct
				if (!(await comparePassword(password, existingUser.password)))
					throw new AuthenticationError('incorrect password')

				// if all are okay, return JWT
				const token = sign({ _id: existingUser._id }, process.env.TOKEN_SECRET, {
					expiresIn: '1d',
				})

				return token
			} catch (error) {
				throw new Error(error?.message)
			}
		},

		createConsignor: async (_, args, { req }) => {
			// check if the user is authenticated -> if not throw error
			const payload = verifyUser(req)

			if (payload._id) {
				/**
				 * user is authenticated and we can proceed with adding a new consignor
				 * extract the fields from the argument params
				 *  */
				const { name, contactNum, gstNum, address } = args.params

				// create a new user
				const newConsignor = new Consignor({
					adminRef: payload._id,
					name,
					contactNum,
					gstNum,
					address,
				})

				try {
					// save user to database
					const savedConsignor = await newConsignor.save()
					// return the user as well as the reference to the admin
					return {
						adminRef: await User.findOne({ _id: savedConsignor.adminRef }),
						id: savedConsignor._id,
						name: savedConsignor.name,
						contactNum: savedConsignor.contactNum,
						gstNum: savedConsignor.gstNum,
						address: savedConsignor.address,
						createdAt: savedConsignor.createdAt,
					}
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		createConsignee: async (_, args, { req }) => {
			// check if the user is authenticated -> if not throw error
			const payload = verifyUser(req)

			if (payload._id) {
				// user is authenticated and we can proceed with adding a new consignor
				// extract the fields from the argument params
				const { name, contactNum, gstNum, address } = args.params

				// create a new consignee
				const newConsignee = new Consignee({
					adminRef: payload._id,
					name,
					contactNum,
					gstNum,
					address,
				})

				try {
					// save consignee to database
					const savedConsignee = await newConsignee.save()
					// return the consignee as well as the reference to the admin
					return {
						adminRef: await User.findOne({ _id: savedConsignee.adminRef }),
						id: savedConsignee._id,
						name: savedConsignee.name,
						contactNum: savedConsignee.contactNum,
						gstNum: savedConsignee.gstNum,
						address: savedConsignee.address,
						createdAt: savedConsignee.createdAt,
					}
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		createTruck: async (_, args, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				const {
					truckNum,
					numWheels,
					model,
					feet,
					truckType,
					mileage,
					mfgName,
					mfgDate,
					tonnage,
				} = args.params
				const newTruck = new Truck({
					adminRef: payload._id,
					truckNum,
					numWheels,
					model,
					feet,
					truckType,
					mileage,
					mfgName,
					mfgDate,
					tonnage,
				})
				try {
					const savedTruck = await newTruck.save()
					return {
						adminRef: await User.findOne({ _id: payload._id }),
						id: savedTruck._id,
						truckNum: savedTruck.truckNum,
						numWheels: savedTruck.numWheels,
						model: savedTruck.model,
						feet: savedTruck.feet,
						truckType: savedTruck.truckType,
						mileage: savedTruck.mileage,
						mfgName: savedTruck.mfgName,
						mfgDate: savedTruck.mfgDate,
						tonnage: savedTruck.tonnage,
						createdAt: savedTruck.createdAt,
					}
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},

		createDriver: async (_, args, { req }) => {
			const payload = verifyUser(req)
			if (payload._id) {
				const {
					name,
					dateOfJoining,
					contactNum,
					altContactNum,
					familyContactNum,
					permanentAddress,
					temporaryAddress,
					licenseNum,
					licenseDoc,
				} = args.params
				const newDriver = new Driver({
					adminRef: payload._id,
					name,
					dateOfJoining,
					contactNum,
					altContactNum,
					familyContactNum,
					permanentAddress,
					temporaryAddress,
					licenseNum,
					licenseDocID: licenseDoc.id,
					licenseDocURL: licenseDoc.url,
				})
				try {
					const savedDriver = await newDriver.save()
					const adminRef = await User.findOne({ _id: payload._id })
					return {
						adminRef,
						id: savedDriver._id,
						name: savedDriver.name,
						dateOfJoining: savedDriver.dateOfJoining,
						contactNum: savedDriver.contactNum,
						altContactNum: savedDriver.altContactNum,
						familyContactNum: savedDriver.familyContactNum,
						permanentAddress: savedDriver.permanentAddress,
						temporaryAddress: savedDriver.temporaryAddress,
						licenseNum: savedDriver.licenseNum,
						licenseDoc: {
							id: savedDriver.licenseDocID,
							url: savedDriver.licenseDocURL,
						},
						createdAt: savedDriver.createdAt,
					}
				} catch (error) {
					throw new Error(error?.message)
				}
			}
		},
	},

	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		serialize: (value) => value.getTime(),
		parseValue: (value) => new Date(value),
		parseLiteral: (ast) => {
			return ast.kind === Kind.INT ? new Date(parseInt(ast.value, 10)) : null
		},
	}),
}
