import React, {useState, useEffect} from 'react';
import './../styles/App.css';

export default function Calculation(props) {
    return(
        <div className="calculation">
            <span className="Total">Total task: {props.Total}</span>
            <span className="completed">Completed: {props.Completed}</span>
            <span className="uncompleted">UnCompleted: {props.Total - props.Completed}</span>
        </div>
    );
}