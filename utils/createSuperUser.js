require('dotenv').config()
const { connect } = require('mongoose')
const readlineSync = require('readline-sync')
const User = require('../models/User')
const { hashPassword } = require('./passwordUtil')
const clc = require('cli-color')

const createSuperUser = async () => {
	const email = readlineSync.questionEMail('Enter email: ')

	// connect to db
	connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

	// check if admin exists
	const existingAdmin = await User.findOne({ email })
	if (existingAdmin) {
		console.error(clc.red(`${clc.underline(email)} already registered as an administrator.`))
		process.exit(1)
	}

	const password = readlineSync.questionNewPassword('Enter password: ')

	// verify user input
	const isOkay = readlineSync.question(
		`Do you want to proceed adding ${clc.green.underline(email)} as administrator? (Y/n): `
	)
	if (isOkay === 'Y' || isOkay === 'y') {
		// create new admin
		const newAdmin = new User({ email, password: await hashPassword(password), isAdmin: true })
		try {
			const savedAdmin = await newAdmin.save()
			console.log(
				clc.green(`\n${clc.underline(savedAdmin.email)} added as a new administrator.\n`)
			)
			process.exit(0)
		} catch (error) {
			console.error(clc.red(error?.message || 'oops! some error occurred. please try again.'))
			process.exit(1)
		}
	} else {
		process.exit(1)
	}
}

createSuperUser()
