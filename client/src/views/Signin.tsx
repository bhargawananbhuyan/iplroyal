import { gql, useMutation } from '@apollo/client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SIGNIN_USER_MUTATION = gql`
	mutation SigninUser($email: String!, $password: String!) {
		signinUser(email: $email, password: $password)
	}
`

const Signin: React.FC = () => {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const [signinUser, { loading, data, error }] = useMutation(SIGNIN_USER_MUTATION)
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		signinUser({ variables: { email: formData.email, password: formData.password } })
	}

	const navigate = useNavigate()
	useEffect(() => {
		if (data?.signinUser) {
			localStorage.setItem('@token', data?.signinUser)
			navigate('/', { replace: true })
			return
		}
	}, [data])

	useEffect(() => {
		if (localStorage.getItem('@token')) {
			navigate('/', { replace: true })
			return
		}
	}, [])

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{error && <section>{JSON.stringify(error?.message)}</section>}
				<div>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						id='email'
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						name='password'
						id='password'
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				<input type='submit' value={loading ? 'Please wait...' : 'Submit'} />
			</form>
		</div>
	)
}

export default Signin
