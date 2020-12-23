import React, { useState, useEffect } from 'react';
import './../styles/App.css';

export default function LoginForm(props) {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	
	return (
		<div className="container">
			<div className="login">
				<h2>TodoApp</h2>
				<input
					autoFocus
					type="text"
					placeholder="Enter username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Enter password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="btn" onClick={() => props.signinHandler(username, password)}>Log in</button>
				<button className="btn" onClick={() => props.signupHandler(username, password)}>Sign up</button>
				{props.error ? <div className="error">{props.error}</div> : null}
			</div>
		</div>
	);
}
