// SignUp.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignUp({ onLogin }) {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    async function submit(e) {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage("Password must be at least 8 characters long and contain at least one number.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/signup", {
                email,
                password,
                username
            });

            if (res.data === "exist") {
                setErrorMessage("User already exists");
            } else if (res.data === "notexist") {
                const userData = { username, email };
                localStorage.setItem('userData', JSON.stringify(userData));
                onLogin(userData);
                navigate("/home");
            } else {
                setErrorMessage("Sign up failed");
            }
        } catch (e) {
            setErrorMessage("An error occurred. Please try again.");
            console.log(e);
        }
    }

    return (
        <div className="signup">
            <div className="signup__inner">
                <div className="signup__logo"></div>

                <div className="signup-content">
                    <div className="signup__item">
                        <h1 className="signup__subtitle title">WELCOME TO SOILESAY</h1>
                        <p className="signup__text text">Practice Kazakh Language skills through fun and interactive games!</p>
                    </div>

                    <div className="signup__item">
                        <h2 className="signup__title title">CREATE ACCOUNT</h2>

                        <form className="signup__form" onSubmit={submit}>
                            <input
                                className="signup__input input"
                                type="text"
                                placeholder="Enter Username"
                                onChange={(e) => setUsername(e.target.value)}
                            ></input>

                            <input
                                className="signup__input input"
                                type="email"
                                placeholder="Enter Email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>

                            <input
                                className="signup__input input"
                                type="password"
                                placeholder="Create password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>

                            {errorMessage && <p className="error-message" >{errorMessage}</p>}

                            <input className="button-submit" type="submit" value="Sign Up" />

                            <br />

                            <p className="text">OR</p>

                            <button className="button button-login">
                                <Link className="link-login" to="/">
                                    Login
                                </Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
