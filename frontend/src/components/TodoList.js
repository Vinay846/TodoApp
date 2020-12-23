import React, { useState, useEffect } from 'react';
import './../styles/App.css';
import ListItem from './ListItem';
import Calculation from './Calculation';
import CurdLoaderHook from './CloaderHook'


function TodoList(props) {
	const [ taskName, setTaskName ] = useState([]);
	const [ currTaskName, setCurrTaskName ] = useState('');
	const [hide, setHide] = useState(false);
	const [crudLoader, showCurdLoader, hideCurdLoader] = CurdLoaderHook();
	let [Completed, setCompleted] = useState(0);
    let count = 0;

	const counter = (arr) => {
		arr.forEach((task, idx) => {
			if(task.done){
			  count++;
			}
			setCompleted(count);
		  })
	}

	const addToList = () => {
		showCurdLoader();
		fetch('https://vinu-backed-todo.herokuapp.com/todo', {
			method: "POST",
			body: JSON.stringify({task: currTaskName}),
			headers: {
				"Content-Type": "application/json"
            },
            credentials: "include"
		})
		.then((r)=> r.json())
		.then((resp)=>{
			// console.log("Got data from Backend ", resp);
			taskName.push(resp);
			setTaskName([ ...taskName ]);
			setCurrTaskName('');
			hideCurdLoader();
		});
	};

	const handleChange = (event) => {
		setCurrTaskName(event.target.value);
	};

	const handleRemoveItem = (idx) => {
		showCurdLoader();
		const idToDelete = taskName[idx]._id;
		fetch(`https://vinu-backed-todo.herokuapp.com/todo/${idToDelete}`, {
            method: "DELETE",
            credentials: "include"
		})
		.then((r)=>{
			// console.log("Got Successfully Delete");
			taskName.splice(idx, 1);
			setTaskName([ ...taskName ]);
			counter(taskName);
			hideCurdLoader();
		});
	};

	const handleUpdate = (idx, newTask) => {
		showCurdLoader();
		const idToEdit = taskName[idx]._id;
		fetch(`https://vinu-backed-todo.herokuapp.com/todo/${idToEdit}`, {
			method: "PUT",
			body: JSON.stringify({task: newTask}),
			headers: {
				"Content-Type": "application/json",
            },
            credentials: "include"
		})
		.then((r)=>r.json())
		.then((resp)=>{
			// console.log("Got Successfully response from PUT ", resp);
			taskName[idx] = resp;
			setTaskName([ ...taskName ]);
			hideCurdLoader();
		});
	};

	const checked = (idx) =>{
		showCurdLoader();
		const idToCheck = taskName[idx]._id;
		fetch(`https://vinu-backed-todo.herokuapp.com/todo/${idToCheck}`, {
			method: "GET",
			credentials: "include"
		})
		.then(r => r.json())
		.then((resp) => {
			taskName[idx] = resp;
			counter(taskName);
			hideCurdLoader();
		});
	}

	useEffect(()=>{
		showCurdLoader();
        fetch('https://vinu-backed-todo.herokuapp.com/todo', {credentials: "include"})
        .then(r => r.json())
        .then((arr) => {
			const sortedArr = arr.sort((a, b) => {
                const aDateNumeric = new Date(a.creationTime).valueOf();
                const bDateNumeric = new Date(b.creationTime).valueOf();
                return aDateNumeric - bDateNumeric;
            });
			// const taskArr = sortedArr.map(item => item.task);
			// console.log(sortedArr);
			setTaskName(sortedArr);
			counter(sortedArr);
			hideCurdLoader();
			
		});
	}, []);

	return (
		<>
		{crudLoader}
		<div id="main">
			<div>
				<h1>Welcome to React TodoApp</h1>
                <ul className="dropdown">
					<img onClick={()=>{setHide(!hide)}} className="profile" src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png" alt="Profile"/>
					{hide ?(
						<>
						<li><b>{props.username}</b></li>
						<li className="logout" onClick={props.logoutHandler}>Logout</li>
						</>
					):(
						null
					)}
				</ul>
				<Calculation
				Total={taskName.length}
				Completed={Completed} 
				/>
			</div>
			<div id="textandbtn">
			<textarea autoFocus placeholder="Task name" id="task" value={currTaskName} onChange={handleChange} />
			<button className="add" id="btn" disabled={currTaskName.trim().length === 0} onClick={addToList}>
				Add Item
			</button>
			</div>
			
			{taskName.map((task, taskIdx) => (
				<ListItem
					task={task}
					key={task._id}
					idx={taskIdx}
					handleUpdate={handleUpdate}
					handleRemoveItem={handleRemoveItem}
					checked={checked}
					taskName={taskName}
				/>
			))}
		</div>
		</>
	);
}

export default TodoList;
