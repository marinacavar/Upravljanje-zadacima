"use client"
import React, { useState } from 'react';
import axios from 'axios';

function UpdateUserModal() {
    const [currentUser, setCurrentUser] = useState({});
    const [updatedUser, setUpdatedUser] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (user) => {
        console.log("Edit button clicked, user:", user);
        setCurrentUser(user);
        setUpdatedUser(user);
        setIsModalOpen(true);
    };

    const handleInputChange = (event) => {
        setUpdatedUser({
            ...updatedUser,
            [event.target.username]: event.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/api/users/${currentUser.id}`, updatedUser);
            setUsers(users.map(user => user.id === currentUser.id ? response.data : user));
            setIsModalOpen(false); // Zatvaranje modala nakon uspješnog ažuriranja
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <>
            {/* Prikazivanje gumba za uređivanje korisnika */}
            <button
                className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => handleEditClick(user)}
            >
                Edit
            </button>

            {/* Modalni prozor za ažuriranje korisnika */}
            {isModalOpen && (
                <div id="updateUserModal" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-2xl">
                        {/* Modalni sadržaj */}
                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            {/* Modalni zaglavlje */}
                            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update User</h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                            {/* Modalno tijelo */}
                            <form action="#" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    {/* Inputi za ažuriranje korisnika */}
                                    {/* Primer: Name */}
                                    <div>
                                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                        <input
                                            type="text"
                                            username="username"
                                            id="username"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            value={updatedUser.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Ostali inputi za ažuriranje korisnika */}
                                </div>
                                {/* Gumbi za ažuriranje i brisanje korisnika */}
                                <div className="flex items-center space-x-4">
                                    <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update User</button>
                                    <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateUserModal;
