import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { login, signUp } from "../../actions/AuthAction";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.authReducer.loading);

    const [isSignup, setIsSignup] = useState(true);
    const [confirmpass, setConfirmpass] = useState(true);
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmpass: ""
    })

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup) {
            data.password === data.confirmpass
                ?
                toast.warn(await dispatch(signUp(data)), {
                    position: "top-center"
                })
                :
                setConfirmpass(false);
        } else {
            toast.warn(await dispatch(login(data)), {
                position: "top-center"
            });
        }
    }

    const resetForm = () => {
        setConfirmpass(true);
        setData({
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmpass: ""
        })
    }

    return (
        <div className="Auth">
            {/* Left Side */}
            <div className="a-left">
                <img src={Logo} alt="" />
                <div className="Webname">
                    <h1>Socio Media</h1>
                    <h6>Connect with the people over the globe.</h6>
                </div>
            </div>

            {/* Right Side  */}

            <div className="a-right">
                <form className="infoForm authForm" onSubmit={handleSubmit}>
                    <h3>{isSignup ? "Sign up" : "Login"} </h3>

                    {isSignup &&
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="infoInput"
                                name="firstname"
                                onChange={handleChange}
                                value={data.firstname}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="infoInput"
                                name="lastname"
                                onChange={handleChange}
                                value={data.lastname}
                            />
                        </div>
                    }

                    <div>
                        <input
                            type="text"
                            className="infoInput"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            placeholder="Usernames"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            className="infoInput"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            placeholder="Password"
                        />
                        {isSignup && <input
                            type="password"
                            className="infoInput"
                            name="confirmpass"
                            onChange={handleChange}
                            value={data.confirmpass}
                            placeholder="Confirm Password"
                        />}
                    </div>

                    <span style={{
                        display: confirmpass ? "none" : "block",
                        color: "red",
                        fontSize: "12px",
                        alignSelf: "flex-end",
                        marginRight: "5px"
                    }}>
                        * Confirm Password is not same
                    </span>

                    <div>
                        <span
                            style={{ fontSize: '12px', cursor: "pointer" }}
                            onClick={() => { setIsSignup((prev) => !prev); resetForm(); }}
                        >
                            {isSignup ? "Already have an account. Login!" : "Don't have an account ? Sign up"}
                        </span>
                    </div>
                    <button className="button infoButton" disabled={loading} type="submit">{loading ? "Loading" : isSignup ? "Signup" : "Login"}</button>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Auth;