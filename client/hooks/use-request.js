import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props= {}) => {
        try {
            setErrors(null); // Clear previous errors
            const response = await axios[method](url, { ...body, ...props })
            if (onSuccess) {
                onSuccess(response.data);
            }
        }
        catch (err) {
            setErrors(<div className='alert alert-danger'>
                <h4>OOPOOPPS......</h4>
                <div className='my-0 h4'>
                    {err.response?.data.errors.map((err, index) => (
                        <div className='my-0' key={index}>{err.message} </div>
                    ))}
                </div>
            </div>)
        }

        
    }

    return [ doRequest, errors ]
}

export default useRequest;