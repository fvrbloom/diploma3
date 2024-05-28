import React from "react";
import { useLocation } from "react-router-dom";

const Profile = () => {
    const location = useLocation();
    const { username, email } = location.state || {};

    return (
        <div className="profile">
            <div className="profile__inner">
                <h2 className="profile__title">My Profile</h2>
                <div className="profile__info">
                    <img className="profile__avatar" src="./images/Avatar.png" alt="User Avatar" />
                    <div className="profile__details">
                        <h3 className="profile__username">Username: {username}</h3>
                        <p className="profile__email">Email: {email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
