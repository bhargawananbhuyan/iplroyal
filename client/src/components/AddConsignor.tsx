import { gql, useMutation, useQuery } from '@apollo/client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const GET_CONSIGNORS = gql`
	query GetConsignors {
		getConsignors {
			id
			name
			contactNum
			gstNum
			address
		}
	}
`

const ADD_CONSIGNOR = gql`
	mutation CreateConsignor($params: ConsignorInput!) {
		createConsignor(params: $params) {
			id
			name
			contactNum
			gstNum
			address
		}
	}
`

type Consignor = {
	id: string
	name: string
	contactNum: string
	gstNum: string
	address: string
}

const AddConsignor: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		contactNum: '',
		gstNum: '',
		address: '',
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const { loading: _loading, data: _data, error: _error } = useQuery(GET_CONSIGNORS)

	const [createConsignor, { loading, error }] = useMutation(ADD_CONSIGNOR, {
		refetchQueries: [{ query: GET_CONSIGNORS }, 'get consignors'],
	})
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await createConsignor({
			variables: {
				params: {
					name: formData?.name,
					contactNum: formData?.contactNum,
					gstNum: formData?.gstNum,
					address: formData?.address,
				},
			},
		})
		setFormData({ name: '', contactNum: '', gstNum: '', address: '' })
	}

	return (
		<div>
			<h1>Add a Consignor</h1>
			<form onSubmit={handleSubmit}>
				{error && <div>{error?.message}</div>}
				<div>
					<label htmlFor='consignorName'>Name:</label>
					<input
						type='text'
						name='name'
						id='consignorName'
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consignorContact'>Contact number:</label>
					<input
						type='text'
						name='contactNum'
						id='consignorContact'
						value={formData.contactNum}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consignorGST'>GST number:</label>
					<input
						type='text'
						name='gstNum'
						id='consignorGST'
						value={formData.gstNum}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consignorAddress'>Address:</label>
					<input
						type='text'
						name='address'
						id='consignorAddress'
						value={formData.address}
						onChange={handleChange}
					/>
				</div>

				<input type='submit' value={loading ? 'Please wait...' : 'Submit'} />
			</form>

			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Contact number</th>
						<th>GST number</th>
						<th>Address</th>
					</tr>
				</thead>
				<tbody>
					{_data?.getConsignors?.map((consignor: Consignor) => (
						<tr key={consignor.id}>
							<td>{consignor.name}</td>
							<td>{consignor.contactNum}</td>
							<td>{consignor.gstNum}</td>
							<td>{consignor.address}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default AddConsignor
