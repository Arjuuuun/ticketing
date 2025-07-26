import { use, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';


const signOut = () => {
    const [doRequest] = useRequest({
        url: "/api/users/signout",
        method: "post",
        body: {},
        onSuccess: () => {
            // Redirect to .... after successful sign out
            Router.push('/');
        }
    });

    useEffect(() => {
        // Call the sign out request when the component mounts
        doRequest();
    }, []);
    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center">Signing Out...</h2>
            </div>
        </div>
    );

};

export default signOut;