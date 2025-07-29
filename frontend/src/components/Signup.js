import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = process.env.REACT_APP_API_BASE_URL;

    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" });

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credential;

        if (credential.password !== credential.cpassword) {
            props.showAlert("Passwords do not match: Password and Confirm Password should be exact same", "danger");
            return;
        }

        const response = await fetch(`${host}/api/auth/createUser`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json();
       // console.log(json);

        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Account created successfully", "success");
            navigate("/");
        } else {
            props.showAlert("Invalid Credential", "danger");
        }
    }

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }

    return (
        <div className='container align-center mt-5'>
            <h2>Create an account to use iNotebook</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={onChange}
                        id="name"
                        name='name'
                        autoComplete="username"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        onChange={onChange}
                        id="email"
                        name='email'
                        autoComplete="email"
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={onChange}
                        id="password"
                        name='password'
                        minLength={8}
                        required
                        autoComplete="new-password"
                    />
                    <div id="passwordHelp" className="form-text">Minimum 8 characters,
                        at least one uppercase, lowercase, digit, and special character</div>

                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        onChange={onChange}
                        id="cpassword"
                        name='cpassword'
                        minLength={8}
                        required
                        autoComplete="new-password"
                    />
                    <div id="passwordHelp" className="form-text">Password and Confirm Password should be same.</div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup;
