import React, { useState, useEffect } from 'react';
import './../styles/App.css';
import LoginForm from './LoginForm';
import TodoList from './TodoList';
import LoaderHook from './LoaderHook';
import CurdLoaderHook from './CloaderHook'

function App() {
	const [loggedIn, setLoggedIn] = useState(true);
	const [error, setError] = useState(undefined);
	const [userName, setuserName] = useState(undefined);
	const [loader, showLoader, hideLoader] = LoaderHook();
	const [crudLoader, showCurdLoader, hideCurdLoader] = CurdLoaderHook();

	const getUserName = () => {
		showLoader();
		return fetch('https://vinu-backed-todo.herokuapp.com/userinfo', {credentials: "include"})
		.then(r => {
			if(r.ok) {
				return r.json();
			}else{
				setLoggedIn(false);
				setuserName(undefined);
				hideLoader();
				return { success: false};
			}
		}).then(r => {
			if(r.success !== false) {
				setLoggedIn(true);
				setuserName(r.userName);
				hideLoader();
			}
		}).catch(()=>{
			console.log("Internet not working");
		})
	}

	useEffect(() => {
		getUserName();
	},[]);

	const logoutHandler = () => {
		return fetch('https://vinu-backed-todo.herokuapp.com/logout', {credentials: "include" })
		.then(r => {
			if(r.ok){
				setLoggedIn(false);
				setuserName(undefined);
				setError(undefined);
			}
		})
	}

	const signinOrSignup = (url, username, password) => {
		showCurdLoader();
		fetch(url, {
			method: "POST",
			body: JSON.stringify({userName: username, password}),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		})
		.then((r)=>{
			if(r.ok){
				return{ success: true };
			}else{
				return r.json()
			}
		})
		.then((r) => {
			if(r.success === true){
				hideCurdLoader();
				return getUserName();
			}else{
				setError(r.err);
				hideCurdLoader();
			}
			
		});
	}
	const signupHandler = (username, password) => {
		signinOrSignup('https://vinu-backed-todo.herokuapp.com/signup', username, password);
	};
	
	const signinHandler = (username, password) => {
		signinOrSignup('https://vinu-backed-todo.herokuapp.com/signin', username, password);
	}
	

	return (
		<>
		{crudLoader}
		{loader}
		{loggedIn ? 
		(
			<TodoList username={userName} logoutHandler={logoutHandler} />
		):(
			<LoginForm
				signupHandler={signupHandler} 
				signinHandler={signinHandler}
				error={error}
			/>
		)}
		</>
	);
}

export default App;
