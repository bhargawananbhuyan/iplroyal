const router = require('express').Router()
const upload = require('multer')({ dest: './uploads' })
const cloudinary = require('cloudinary').v2
const fs = require('fs/promises')

// cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * ------------------------------------------
 * @access PRIVATE
 * @route /api/upload
 * @desc upload a new license document
 * ------------------------------------------
 */
router.post('/', upload.single('licenseDoc'), async (req, res) => {
	try {
		const fileRef = `./uploads/${req.file.filename}`

		// upload the file
		const uploadRef = await cloudinary.uploader.upload(fileRef, {
			upload_preset: 'vwfqzpne',
		})

		// remove the file from filesystem
		await fs.unlink(fileRef)

		res.status(201).json({ data: { id: uploadRef.public_id, url: uploadRef.secure_url } })
	} catch (error) {
		res.status(500).json({ error: error ?? 'error occurred' })
	}
})

/**
 * ------------------------------------------
 * @access PRIVATE
 * @route /api/upload
 * @desc delete an existing license document
 * ------------------------------------------
 */
router.delete('/', async (req, res) => {
	try {
		await cloudinary.api.delete_resources([req.body.id])
		res.status(204).json({ data: 'deleted successfully' })
	} catch (error) {
		res.status(500).json({ error: error ?? 'error occurred' })
	}
})

module.exports = router
