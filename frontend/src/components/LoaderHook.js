import React, {useState} from 'react';
import Loading from './Loading';

export default function LoaderHook() {
    const [loading, setLoading] = useState(false);
    return [ 
        loading ? <Loading /> :null,
        ()=> setLoading(true), //Show loader
        ()=> setLoading(false) //hide loader
     ];
}