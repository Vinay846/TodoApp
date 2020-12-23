import React, {useState, useEffect} from 'react';
import './../styles/App.css';
import Calculation from './Calculation';

export default function ListItem(props) {
    const [editedItem, setEditedItem] = useState(props.task.task);
    const [editedMode, setEditedMode] = useState(false);
    const [done, setDone] = useState(props.task.done);
    

    const handleChange=(event)=>{
      setEditedItem(event.target.value);
    };
    
    const saveEditedItem =()=>{
        props.handleUpdate(props.idx, editedItem);
        setEditedMode(false);
    };

    const doneHandle =()=> {
      props.checked(props.idx);
      setDone(!done);
    };
    return (
      <div className="list">
        { editedMode ? (
          <>
          <div id="listItem">
            <textarea autoFocus placeholder="update task" className="editTask " value={editedItem} onChange={handleChange}></textarea>
            <button className="saveTask" disabled={editedItem.trim().length===0} onClick={saveEditedItem}>Save Task</button>
            </div>
          </>
        ) : (
          <>
          <div id="listItem">
            <input defaultChecked={done} onClick={doneHandle} type="checkbox" name="taskName"/>
            <label id="taskName" htmlFor="taskName"> {done ?<del>{props.task.task}</del>: props.task.task}</label>
            <button className="edit" onClick={()=>{setEditedMode(true)}}>edit</button>
            <button className="delete" onClick={()=> props.handleRemoveItem(props.idx)}>delete</button>
            </div>
          </>
        )}
      </div>);
}