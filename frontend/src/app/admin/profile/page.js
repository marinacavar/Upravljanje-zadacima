"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import axios from 'axios';
import { HiOutlineUser } from "react-icons/hi2";
import { FiEdit3 } from "react-icons/fi";

function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState({username: false, email: false});
    const [editableUserInfo, setEditableUserInfo] = useState({username: '', email: ''});
    const [refresh, setRefresh] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const maxLength = 20;
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        if (userId) {
            fetchUserInfo(userId); 
        }
    }, [refresh]);

    useEffect(() => {
        if (userInfo && editableUserInfo) {
            if (editableUserInfo.username !== userInfo.username || editableUserInfo.email !== userInfo.email) {
                setHasChanges(true);
            } else {
                setHasChanges(false);
            }
        }
    }, [editableUserInfo, userInfo]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${userId}`); 
            setUserInfo(response.data);
            setEditableUserInfo(response.data); 
            setIsEditing({username: true, email: false}); 
        } catch (error) {
            console.error("Error fetching user information", error);
        }
    };

    const handleInputChange = (event, field) => {
        setEditableUserInfo({...editableUserInfo, [field]: event.target.value});
        setInputValue(event.target.value);
        setHasChanges(true);
    };
    const handleSaveChanges = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.put(`http://localhost:3001/api/users/${userId}`, editableUserInfo);
            setUserInfo(response.data);
            setIsEditing(prevState => ({...prevState, username: false, email: false}));
            setRefresh(!refresh);
            setHasChanges(false);
        } catch (error) {
            console.error("Error updating user information", error);
        }
    };

    return (
        <div className='max-w-none flex lg:flex-row lg:items-start lg:justify-start flex-grow'>
            <div className="lg:w-1/5">
                <Sidebar/>
            </div>
            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 flex-grow mx-auto lg:mx-0 lg:ml-auto lg:mr-32 mt-14">
                {userInfo && (
                    <div>
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900 flex items-center">
                                <HiOutlineUser className="mr-2" size={22} /> Personal details
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-500">Update your personal information</p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 self-center">Full name</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center justify-between">
                                        {isEditing.username ? (
                                            <div className="relative flex">
                                                <input 
                                                    type="text" 
                                                    className='w-60 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                                                    value={inputValue || editableUserInfo.username} 
                                                    onChange={(e) => handleInputChange(e, 'username')} 
                                                    maxLength={maxLength}
                                                />
                                                <p className="absolute right-0 bottom-0 text-right text-xs text-gray-500 w-60">{`${editableUserInfo.username.length}/${maxLength}`}</p>
                                            </div>  
                                        ) : (
                                            <span className="self-center">{userInfo.username}</span>
                                        )}
                                        <FiEdit3 className="cursor-pointer text-gray-400 w-5 h-5 self-center" />
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userInfo.email}</dd>
                                </div>
                                
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900 self-center">Current Password</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        <input type="password"
                                         className='w-60 border-b border-gray-300 focus:outline-none focus:border-blue-500'/>
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">New Password</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        <input type="password"
                                        className='w-60 border-b border-gray-300 focus:outline-none focus:border-blue-500' />
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <button 
                        onClick={handleSaveChanges} 
                        disabled={!hasChanges}
                        className={`flex items-center justify-center text-white font-semibold rounded-md py-2 px-20 ml-auto ${hasChanges ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;