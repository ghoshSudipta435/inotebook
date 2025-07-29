import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Login = (props) => {
    const host = process.env.REACT_APP_API_BASE_URL;

    const [credential, setCredential] = useState({ email: "", password: "" });

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        //API CALL
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjg1ZmJlZTY1MjM5NDBkM2UyYWI5ZjgyIn0sImlhdCI6MTc1MTEwNTMyM30.Ofuk-1i14XUdr18iM8F9QrWRv6RPDgeZuCAtU85K5Sc"
            },
            body: JSON.stringify({ email: credential.email, password: credential.password })
        });

        const json = await response.json();
        if (json.success) {
            //redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Loged in successfully", "success");
            navigate("/");
        }
        else {
            props.showAlert("Invalid details", "danger");
        }


    }
    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    return (

        <div className='container align-center mt-5'>
            <h2>Login to Continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={credential.email}
                        onChange={onChange}
                        id="email"
                        name='email'
                        aria-describedby="emailHelp"
                        autoComplete="email"
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={credential.password}
                        onChange={onChange}
                        id="password"
                        name='password'
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>


        </div>
    )
}

export default Login
