import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation, useQuery } from '@apollo/client'

const validationSchema = Yup.object().shape({
	truckNum: Yup.string().required('required'),
	numWheels: Yup.number(),
	model: Yup.string().required('required'),
	feet: Yup.number().required('required'),
	truckType: Yup.number().min(1).required('required'),
	mileage: Yup.number(),
	mfgName: Yup.string().required('required'),
	mfgDate: Yup.date().required('required'),
	tonnage: Yup.number().required('required'),
})

const GET_TRUCKS = gql`
	query GetTrucks {
		getTrucks {
			id
			truckNum
			numWheels
			model
			feet
			truckType
			mileage
			mfgName
			mfgDate
			tonnage
			createdAt
		}
	}
`

const CREATE_TRUCK = gql`
	mutation CreateTruck($params: TruckInput!) {
		createTruck(params: $params) {
			id
			truckNum
			numWheels
			model
			feet
			truckType
			mileage
			mfgName
			mfgDate
			tonnage
			createdAt
		}
	}
`

type Truck = {
	id: string
	truckNum: string
	numWheels?: number
	model: string
	feet: number
	truckType: number
	mileage?: number
	mfgName: string
	mfgDate: Date
	tonnage: number
}

const AddTruck: React.FC = () => {
	const { loading: _loading, data: _data, error: _error } = useQuery(GET_TRUCKS)
	const [createTruck, { loading }] = useMutation(CREATE_TRUCK, {
		refetchQueries: [{ query: GET_TRUCKS }, 'get trucks'],
	})

	const formik = useFormik({
		initialValues: {
			truckNum: '',
			numWheels: '',
			model: '',
			feet: '',
			truckType: '',
			mileage: '',
			mfgName: '',
			mfgDate: '',
			tonnage: '',
		},
		validationSchema,
		onSubmit: async (
			{ truckNum, numWheels, model, feet, truckType, mileage, mfgName, mfgDate, tonnage },
			{ resetForm }
		) => {
			await createTruck({
				variables: {
					params: {
						truckNum,
						numWheels: parseInt(numWheels),
						model,
						feet: parseFloat(feet),
						truckType: parseInt(truckType),
						mileage: parseFloat(mileage),
						mfgName,
						mfgDate,
						tonnage,
					},
				},
			})
			resetForm()
		},
	})

	return (
		<div>
			<h1>AddTruck</h1>

			<form onSubmit={formik.handleSubmit}>
				<div>
					<label htmlFor='truckNum'>Truck no.:</label>
					<input
						type='text'
						name='truckNum'
						id='truckNum'
						value={formik.values.truckNum}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='numWheels'>No. of wheels:</label>
					<input
						type='number'
						name='numWheels'
						id='numWheels'
						value={formik.values.numWheels}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='model'>Model:</label>
					<input
						type='text'
						name='model'
						id='model'
						value={formik.values.model}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='feet'>Feet:</label>
					<input
						type='number'
						name='feet'
						id='feet'
						value={formik.values.feet}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='truckType'>Truck type:</label>
					<select
						name='truckType'
						id='truckType'
						value={formik.values.truckType ? formik.values.truckType : 0}
						onChange={formik.handleChange}
					>
						<option value={0} disabled>
							-- select a type --
						</option>
						<option value={1}>Type 1</option>
						<option value={2}>Type 2</option>
					</select>
				</div>
				<div>
					<label htmlFor='mileage'>Mileage:</label>
					<input
						type='number'
						name='mileage'
						id='mileage'
						value={formik.values.mileage}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='mfgName'>Manufacturer name:</label>
					<input
						type='text'
						name='mfgName'
						id='mfgName'
						value={formik.values.mfgName}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='mfgDate'>Manufacture date:</label>
					<input
						type='date'
						name='mfgDate'
						id='mfgDate'
						value={formik.values.mfgDate}
						onChange={formik.handleChange}
					/>
				</div>
				<div>
					<label htmlFor='tonnage'>Tonnage:</label>
					<input
						type='number'
						name='tonnage'
						id='tonnage'
						value={formik.values.tonnage}
						onChange={formik.handleChange}
					/>
				</div>
				<input type='submit' value={loading ? 'Please wait...' : 'Submit'} />
			</form>

			<table>
				<thead>
					<tr>
						<th>Truck no.</th>
						<th>No. of wheels</th>
						<th>Model</th>
						<th>Feet</th>
						<th>Type</th>
						<th>Mileage</th>
						<th>Mfg. name</th>
						<th>Mfg. date</th>
						<th>Tonnage</th>
					</tr>
				</thead>
				<tbody>
					{_data?.getTrucks?.map((truck: Truck) => (
						<tr key={truck.id}>
							<td>{truck.truckNum}</td>
							<td>{truck.numWheels}</td>
							<td>{truck.model}</td>
							<td>{truck.feet}</td>
							<td>{truck.truckType}</td>
							<td>{truck.mileage}</td>
							<td>{truck.mfgName}</td>
							<td>{new Date(truck.mfgDate).toLocaleDateString('en-IN')}</td>
							<td>{truck.tonnage}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default AddTruck
