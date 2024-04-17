"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';

function Profile() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Extract user information from the token stored in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token); // Assuming you have a function to parse JWT tokens
            setUserInfo(decodedToken); // Set user information from the decoded token
        }
    }, []);

    // Function to parse JWT tokens
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    return (
        <div>
            <Sidebar/>
            <div>
                {userInfo && (
                    <div>
                        <h2>Welcome, {userInfo.username}</h2>
                        <p>Email: {userInfo.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
