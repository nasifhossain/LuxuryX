import { useEffect, useState } from "react";

function useFetch(link,options={}){

    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    
    useEffect(()=>{
        const fetchData = async ()=>{
            setLoading(true);
            try {
                const response = await fetch(link,{...options});
                if(!response.ok) throw new Error(response.statusText);
                const result = await response.json();
                if(result) setData(result);
                setError(null);
                
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally{
                setLoading(false);
            }
           
        }
        fetchData();
    },[link]);
    return {data,loading,error};
}
export default useFetch;