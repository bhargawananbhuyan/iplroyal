import React, { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedView: React.FC<PropsWithChildren> = (props) => {
	const navigate = useNavigate()

	useEffect(() => {
		if (!localStorage.getItem('@token')) {
			navigate('/signin', { replace: true })
			return
		}
	}, [])

	return <>{props.children}</>
}

export default ProtectedView
