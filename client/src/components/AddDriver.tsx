import { gql, useMutation, useQuery } from '@apollo/client'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { ChangeEvent, useState } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
	name: Yup.string().required(),
	dateOfJoining: Yup.date().required(),
	contactNum: Yup.number().required(),
	altContactNum: Yup.number(),
	familyContactNum: Yup.number(),
	permanentAddress: Yup.string().required(),
	temporaryAddress: Yup.string().required(),
	licenseNum: Yup.string().required(),
	licenseDoc: Yup.mixed().required(),
})

type LicenseDoc = {
	preview: string
	data: Blob | string
}

const GET_DRIVERS = gql`
	query GetDrivers {
		getDrivers {
			id
			name
			dateOfJoining
			contactNum
			altContactNum
			familyContactNum
			permanentAddress
			temporaryAddress
			licenseNum
			licenseDoc {
				id
				url
			}
		}
	}
`

const CREATE_DRIVER = gql`
	mutation CreateDriver($params: DriverInput!) {
		createDriver(params: $params) {
			id
		}
	}
`

const AddDriver: React.FC = () => {
	const [licenseDoc, setLicenseDoc] = useState<LicenseDoc>({
		preview: '',
		data: '',
	})

	const { loading, data, error } = useQuery(GET_DRIVERS)
	const [createDriver, { loading: _loading, data: _data, error: _error }] = useMutation(
		CREATE_DRIVER,
		{
			refetchQueries: [{ query: GET_DRIVERS }, 'get drivers'],
		}
	)

	const formik = useFormik({
		initialValues: {
			name: '',
			dateOfJoining: '',
			contactNum: '',
			altContactNum: '',
			familyContactNum: '',
			permanentAddress: '',
			temporaryAddress: '',
			licenseNum: '',
			licenseDoc: '',
		},
		validationSchema,
		onSubmit: async (values) => {
			// upload license doc
			const formData = new FormData()
			formData.append('licenseDoc', licenseDoc.data)
			const res = await axios.post('/api/upload', formData, {
				headers: {
					'Content-type': 'multipart/form-data',
					authorization: `Bearer ${localStorage.getItem('@token')}`,
				},
			})
			if (res.status === 201) {
				const { id, url } = res.data?.data
				createDriver({
					variables: {
						params: {
							name: values.name,
							dateOfJoining: values.dateOfJoining,
							contactNum: values.contactNum,
							altContactNum: values.altContactNum,
							familyContactNum: values.familyContactNum,
							permanentAddress: values.permanentAddress,
							temporaryAddress: values.temporaryAddress,
							licenseNum: values.licenseNum,
							licenseDoc: {
								id,
								url,
							},
						},
					},
				})
			}
		},
	})

	return (
		<div>
			<h1>AddDriver</h1>

			<form onSubmit={formik.handleSubmit}>
				{JSON.stringify(formik.errors)}
				<section>
					<h2>Personal details</h2>
					<div>
						<label htmlFor='driverName'>Name:</label>
						<input
							type='text'
							name='name'
							id='driverName'
							value={formik.values.name}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='dateOfJoining'>Date of joining:</label>
						<input
							type='date'
							name='dateOfJoining'
							id='dateOfJoining'
							value={formik.values.dateOfJoining}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='contactNum'>Contact no.</label>
						<input
							type='text'
							name='contactNum'
							id='contactNum'
							value={formik.values.contactNum}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='altContactNum'>Alternate contact no.</label>
						<input
							type='text'
							name='altContactNum'
							id='altContactNum'
							value={formik.values.altContactNum}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='familyContactNum'>Family contact no.</label>
						<input
							type='text'
							name='familyContactNum'
							id='familyContactNum'
							value={formik.values.familyContactNum}
							onChange={formik.handleChange}
						/>
					</div>
				</section>

				<section>
					<h2>Address details</h2>
					<div>
						<label htmlFor='permanentAddress'>Permanent address:</label>
						<textarea
							name='permanentAddress'
							id='permanentAddress'
							rows={3}
							className='resize-none'
							value={formik.values.permanentAddress}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='isSame'>Temporary address same as permanent?</label>
						<input type='checkbox' name='isSame' id='isSame' />
					</div>
					<div>
						<label htmlFor='temporaryAddress'>Temporary address:</label>
						<textarea
							name='temporaryAddress'
							id='temporaryAddress'
							rows={3}
							className='resize-none'
							value={formik.values.temporaryAddress}
							onChange={formik.handleChange}
						/>
					</div>
				</section>

				<section>
					<div>
						<label htmlFor='licenseNum'>License no.</label>
						<input
							type='text'
							name='licenseNum'
							id='licenseNum'
							value={formik.values.licenseNum}
							onChange={formik.handleChange}
						/>
					</div>
					<div>
						<label htmlFor='licenseDoc'>License document</label>
						<input
							type='file'
							name='licenseDoc'
							id='licenseDoc'
							value={formik.values.licenseDoc}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								formik.handleChange(e)
								setLicenseDoc({
									preview: URL.createObjectURL(e.target.files![0]),
									data: e.target.files![0],
								})
							}}
						/>
						{/* {licenseDoc.data && (
							<div className='fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 grid place-items-center'>
								<img
									src={licenseDoc.preview}
									alt=''
									className='max-w-sm sm:max-w-lg h-auto shadow-xl'
								/>
							</div>
						)} */}
					</div>
				</section>

				<input type='submit' value={_loading ? 'Please wait...' : 'Submit'} />
			</form>

			{data?.getDrivers?.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Date of joining</th>
							<th>Contact no.</th>
							<th>Alt. contact no.</th>
							<th>Family contact no.</th>
							<th>Permanent address</th>
							<th>Temporary address</th>
							<th>License</th>
						</tr>
					</thead>
					<tbody>
						{data?.getDrivers?.map((driver: any) => (
							<tr key={driver.id}>
								<td>{driver.name}</td>
								<td>
									{new Date(driver.dateOfJoining).toLocaleDateString('en-IN')}
								</td>
								<td>{driver.contactNum}</td>
								<td>{driver.altContactNum ? driver.altContactNum : '----'}</td>
								<td>
									{driver.familyContactNum ? driver.familyContactNum : '----'}
								</td>
								<td>{driver.permanentAddress}</td>
								<td>{driver.temporaryAddress}</td>
								<td>
									<a href={driver.licenseDoc.url}>{driver.licenseNum}</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default AddDriver
