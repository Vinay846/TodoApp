import React, {useState} from 'react';
import CrudLoading from './Cloading';


export default function CurdLoaderHook() {
    const [loading, setLoading] = useState(false);
    return [ 
        loading ? <CrudLoading /> :null,
        ()=> setLoading(true), //Show loader
        ()=> setLoading(false) //hide loader
     ];
}