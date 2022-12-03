import React from 'react'
import { Switch, Route, } from "react-router-dom";

export const AuthLayout = ({children}) => {
	return (
		<div className="auth-container">
			{children}
		</div>
	)
}


export default AuthLayout
