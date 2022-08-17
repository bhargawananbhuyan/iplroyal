import { gql, useMutation, useQuery } from '@apollo/client'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const GET_CONSIGNEES = gql`
	query GetConsignees {
		getConsignees {
			id
			name
			contactNum
			gstNum
			address
		}
	}
`

const ADD_CONSIGNEE = gql`
	mutation CreateConsignee($params: ConsigneeInput!) {
		createConsignee(params: $params) {
			id
			name
			contactNum
			gstNum
			address
		}
	}
`

type Consignee = {
	id: string
	name: string
	contactNum: string
	gstNum: string
	address: string
}

const AddConsignee: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		contactNum: '',
		gstNum: '',
		address: '',
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const { loading: _loading, data: _data, error: _error } = useQuery(GET_CONSIGNEES)

	const [createConsignee, { loading, error }] = useMutation(ADD_CONSIGNEE, {
		refetchQueries: [{ query: GET_CONSIGNEES }, 'get consignees'],
	})
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await createConsignee({
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
			<h1>Add a Consignee</h1>
			<form onSubmit={handleSubmit}>
				{error && <div>{error?.message}</div>}
				<div>
					<label htmlFor='consigneeName'>Name:</label>
					<input
						type='text'
						name='name'
						id='consigneeName'
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consigneeContact'>Contact number:</label>
					<input
						type='text'
						name='contactNum'
						id='consigneeContact'
						value={formData.contactNum}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consigneeGST'>GST number:</label>
					<input
						type='text'
						name='gstNum'
						id='consigneeGST'
						value={formData.gstNum}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='consigneeAddress'>Address:</label>
					<input
						type='text'
						name='address'
						id='consigneeAddress'
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
					{_data?.getConsignees?.map((consignee: Consignee) => (
						<tr key={consignee.id}>
							<td>{consignee.name}</td>
							<td>{consignee.contactNum}</td>
							<td>{consignee.gstNum}</td>
							<td>{consignee.address}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default AddConsignee
