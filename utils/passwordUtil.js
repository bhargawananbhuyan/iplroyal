const { genSalt, hash, compare } = require('bcryptjs')

const hashPassword = async (password) => {
	const salt = await genSalt(10)
	const hashedPassword = await hash(password, salt)
	return hashedPassword
}

const comparePassword = async (password, hash) => await compare(password, hash)

module.exports = {
	hashPassword,
	comparePassword,
}
