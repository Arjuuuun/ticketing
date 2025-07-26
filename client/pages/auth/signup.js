import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doRequest, errors] = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: { email, password },
        onSuccess: (data) => Router.push('/')
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        doRequest();
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center">Create an Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    {errors && <div className="mb-3">{errors}</div>}
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
