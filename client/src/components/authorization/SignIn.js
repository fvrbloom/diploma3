import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignIn({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function submit(e) {
        e.preventDefault();

        try {
            await axios
                .post("http://localhost:8000/", {
                    email,
                    password,
                })
                .then((res) => {
                    if (res.data.status === "exist") {
                        onLogin({ email, username: res.data.username, isAdmin: res.data.isAdmin });
                        if (res.data.isAdmin) {
                            navigate("/admin");
                        } else {
                            navigate("/home");
                        }
                    } else if (res.data.status === "notexist") {
                        setErrorMessage("User has not signed up");
                    } else if (res.data.status === "wrongpassword") {
                        setErrorMessage("Incorrect password");
                    }
                })
                .catch((e) => {
                    setErrorMessage("An error occurred. Please try again.");
                    console.log(e);
                });
        } catch (e) {
            setErrorMessage("An error occurred. Please try again.");
            console.log(e);
        }
    }

    return (
        <div className="signin">
            <div className="signin__inner">
                <div className="signup__logo"></div>
                <div className="signin-content">
                    <h1 className="signin__title title">SIGN IN</h1>
                    <form className="signin__form" onSubmit={submit}>
                        <input
                            className="signin__input input"
                            type="email"
                            placeholder="Enter email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="signin__input input"
                            type="password"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input className="button-submit" type="submit" value="Submit" />
                        <br />
                        <p className="text">OR</p>
                        <button className="button button-login">
                            <Link className="link-login" to="/signup">
                                Sign Up
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
