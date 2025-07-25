import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = process.env.REACT_APP_API_BASE_URL;

    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" });

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credential
        // ✅ Check if password and confirm password match
        if (credential.password !== credential.cpassword) {
            props.showAlert("Passwords do not match: Password and Confirm Password should be exact same", "danger");
            return;
        }
        //API CALL
        const response = await fetch(`${host}/api/auth/createUser`, {

            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json();
        console.log(json)
        if (json.success) {
            //redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Account created successfully", "success");

            navigate("/");
        }
        else {
            props.showAlert("Invalid Credential", "danger");
        }

    }
    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    return (
        <div className='container align-center mt-5'>
            <h2>Create an account to use to iNotebook</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input type="text" className="form-control" onChange={onChange} id="name" name='name' aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} id="email" name='email' aria-describedby="emailHelp" />
                    <div id="email" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name='password' minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="cpassword" name='cpassword' minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default Signup
