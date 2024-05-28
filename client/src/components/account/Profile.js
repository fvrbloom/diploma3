import React from "react";
import { useLocation } from "react-router-dom";

const Profile = () => {
    const location = useLocation();
    const { username, email } = location.state || {};

    return (
        <div className="profile content__body">
            <div className='container'>
                <div className="profile__inner">
                    <h2 className="profile__title title">My Profile</h2>
                    <div className="profile__info">
                        <div className="profile__details">
                            <h3 className="profile__username"><b>Username:</b> {username}</h3>
                            <p className="profile__email"><b>Email:</b> {email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
