const { gql } = require('apollo-server-express')

module.exports = gql`
	scalar Date

	type User {
		id: ID!
		fullName: String
		email: String!
		password: String!
		isAdmin: Boolean!
		createdAt: Date!
	}

	type Consignor {
		id: ID!
		adminRef: User!
		name: String!
		contactNum: String!
		gstNum: String!
		address: String!
		createdAt: Date!
	}

	input ConsignorInput {
		name: String!
		contactNum: String!
		gstNum: String!
		address: String!
	}

	type Consignee {
		id: ID!
		adminRef: User!
		name: String!
		contactNum: String!
		gstNum: String!
		address: String!
		createdAt: Date!
	}

	input ConsigneeInput {
		name: String!
		contactNum: String!
		gstNum: String!
		address: String!
	}

	type Truck {
		id: ID!
		adminRef: User!
		truckNum: String!
		numWheels: Int
		model: String!
		feet: Int!
		truckType: Int!
		mileage: Float
		mfgName: String!
		mfgDate: Date!
		tonnage: Float!
		createdAt: Date!
	}

	input TruckInput {
		truckNum: String!
		numWheels: Int
		model: String!
		feet: Int!
		truckType: Int!
		mileage: Float
		mfgName: String!
		mfgDate: Date!
		tonnage: Float!
	}

	type LicenseDoc {
		id: ID!
		url: String!
	}

	input LicenseInput {
		id: ID!
		url: String!
	}

	type Driver {
		id: ID!
		adminRef: User!
		name: String!
		dateOfJoining: Date!
		contactNum: String!
		altContactNum: String
		familyContactNum: String
		permanentAddress: String!
		temporaryAddress: String!
		licenseNum: String!
		licenseDoc: LicenseDoc!
	}

	input DriverInput {
		name: String!
		dateOfJoining: Date!
		contactNum: String!
		altContactNum: String
		familyContactNum: String
		permanentAddress: String!
		temporaryAddress: String!
		licenseNum: String!
		licenseDoc: LicenseInput!
	}

	type Query {
		getConsignors: [Consignor!]!
		getConsignees: [Consignee!]!
		getTrucks: [Truck!]!
		getDrivers: [Driver!]!
	}

	type Mutation {
		createUser(email: String!, password: String!): User!
		signinUser(email: String!, password: String!): String!
		createConsignor(params: ConsignorInput!): Consignor!
		createConsignee(params: ConsigneeInput!): Consignee!
		createTruck(params: TruckInput!): Truck!
		createDriver(params: DriverInput!): Driver!
	}
`
