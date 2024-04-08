
"use client";
import React from 'react'
import Sidebar from '../sidebar';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from 'axios';


const Users = () => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [currentPreviewedUser, setCurrentPreviewedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [openDropdowns, setOpenDropdowns] = useState(Array(users.length).fill(false));
    const dropdownRefs = useRef([]);

    

    useEffect(() => {
        fetchUsers();
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleDropdown = (index) => {
        setOpenDropdowns((prevState) => {
            const updatedDropdowns = [...prevState];
            updatedDropdowns[index] = !updatedDropdowns[index];
            return updatedDropdowns;
        });
    };

    const handleClickOutside = (event) => {
        dropdownRefs.current.forEach((ref, index) => {
            if (ref && !ref.contains(event.target)) {
                setOpenDropdowns((prevState) => {
                    const updatedDropdowns = [...prevState];
                    updatedDropdowns[index] = false;
                    return updatedDropdowns;
                });
            }
        });
    };
    

    




//  user add
    
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    //edit

    const handleEditClick = (user) => {
        setCurrentUser(user); // Postavite trenutnog korisnika u stanje
        setIsModalOpen(true); // Otvorite modal za uređivanje
    };
    
    //read

    const handlePreviewClick = (user) => {
        setCurrentPreviewedUser(user);
        setIsPreviewModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        
        // If user confirms deletion, proceed with delete operation
        if (confirmDelete) {
            axios.delete(`http://localhost:3001/api/users/${id}`)
                .then(() => {
                    fetchUsers(); // Fetch updated user list
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };
    

    
    
    
  

  
  
  return (
    <div className='flex'>
            <Sidebar />
            <section className="bg-gray-100 dark:bg-gray-900 p-20 antialiased">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="flex-1 ml-0 md:ml-72 md:pl-4 pt-20 md:pt-0">
                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                {/* Search form */}
                                <div className="w-full md:w-1/2">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                {/* Search icon */}
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.817a6 6 0 01-8.657-8.268l-4-4A1 1 0 011.105.105l4 4A6 6 0 012 8zm14.208 8.207a1 1 0 01-1.414 1.414l-4.818-4.817a6 6 0 010-8.485l4.818-4.817a1 1 0 111.414 1.414l-4.818 4.817a4 4 0 010 5.657l4.818 4.817z" />
                                                </svg>
                                            </div>
                                            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 pl-10 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                                        </div>
                                    </form>
                                </div>
                                {/* Buttons */}
                                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    {/* Add User button */}
                                    <button
                                        type="button"
                                        id="createProductModalButton"
                                        className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md py-2 px-4"
                                        onClick={handleModalToggle}
                                    >
                                        <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                        </svg>
                                        Add User
                                    </button>
                                    {/* Dropdown menu */}
                                    <div className="relative">
                                        <button
                                            id="actionsDropdownButton"
                                            data-dropdown-toggle="actionsDropdown"
                                            className="w-full md:w-auto flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300"
                                        >
                                            <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                            Actions
                                            <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </button>
                                        {/* Dropdown content */}
                                        <div id="actionsDropdown" className="hidden absolute z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                                                <li>
                                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a>
                                                </li>
                                            </ul>
                                            <div className="py-1">
                                                <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                                    Delete All
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Filter button */}
                                    <button
                                        id="filterDropdownButton"
                                        data-dropdown-toggle="filterDropdown"
                                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17a1 1 0 01-1-1v-3.586L4.293 12.707a1 1 0 01-.293-.707v-6A1 1 0 013 3zm5 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-.293.707L12 9.414V13a1 1 0 01-.293.707l-1.414 1.414A1 1 0 019 15h-2a1 1 0 01-.707-.293L5.293 12.707A1 1 0 015 12V8.414L3.707 7.121A1 1 0 013 7V4a1 1 0 011-1zm1 3v3h4V6H9zM5 9v2h2V9H5zm10 0v2h2V9h-2z" />
                                        </svg>
                                        Filter
                                        <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </button>
                                    {/* Filter dropdown */}
                                    <div id="filterDropdown" className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                                        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h6>
                                        <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                            <li className="flex items-center">
                                                {/* Add filter options here */}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-4 py-4">Name</th>
                                            <th scope="col" className="px-4 py-3">Email</th>
                                            {/* <th scope="col" className="px-4 py-3">Password</th> */}
                                            <th scope="col" className="px-4 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map((user, index) => (
                                            <tr key={user.id} className="border-b dark:border-gray-700">
                                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.username}</td>
                                                <td className="px-4 py-3">{user.email}</td>
                                                {/* <td className="px-4 py-3">{user.password}</td> */}
                                                <td className="px-4 py-3 flex items-center justify-end" ref={(el) => (dropdownRefs.current[index] = el)}>
                            
                                        
                                                    <button
                                                        className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800"
                                                        type="button"
                                                        onClick={() => toggleDropdown(index)}
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                    {/* Dropdown content */}
                                                    {openDropdowns[index] && (
                                                        <div id="dropdown" className="absolute z-10 bg-white rounded shadow dark:bg-gray-700">
                                                            <ul className="py-1 text-x" aria-labelledby="dropdown-button">
                                                                <li>
                                                                    <button
                                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                        onClick={() => handleEditClick(user)}
                                                                    >
                                                                        <FaEdit className="w-4 h-4 mr-2" />
                                                                        Edit
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                        onClick={() => handlePreviewClick(user)}
                                                                    >
                                                                        <FaEye className="w-4 h-4 mr-2" />
                                                                        Preview
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-600"
                                                                        onClick={() => handleDeleteClick(user._id)}
                                                                    >
                                                                        <RiDeleteBin5Fill className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    Showing {indexOfFirstUser + 1}-{indexOfLastUser} of {users.length}
                                </span>
                                <ul className="inline-flex items-stretch -space-x-px">
                                    {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => paginate(index + 1)}
                                                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === index + 1 ? 'text-primary-600 bg-primary-100' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} ${index === 0 ? 'rounded-l-lg' : ''} ${index === Math.ceil(users.length / usersPerPage) - 1 ? 'rounded-r-lg' : ''}`}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
 


 
 
 
 
 

  {isModalOpen && (
        <div id="createProductModal" className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-gray-300 bg-opacity-75">
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add User</h3>
                    <button 
                        type="button" 
                        onClick={handleModalToggle} 
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type user name" required=""/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Email" required=""/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Password" required=""/>
                        </div>
                    </div>
                    <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                        </svg>
                        Add new user
                    </button>
               
                </form>
            </div>
        </div>
    )}


{/* <!-- Update modal --> */}
<div id="updateProductModal" className={`hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 ${isModalOpen ? '' : 'hidden'}`}>
    <div class="relative p-4 w-full max-w-2xl">
        {/* <!-- Modal content --> */}
        
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            {/* <!-- Modal header --> */}
            <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Update Product</h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            {/* <!-- Modal body --> */}
            {currentUser && (
            <form action="#">
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" id="name" value={currentUser.name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ex. Admin"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="text" name="email" id="email" value={currentUser.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ex. admin@gmail.com"/>
                    </div>
                     <div> 
                         <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label> 
                         <input type="password" name="password" id="password"value={currentUser.password} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12345678"/> 
                     </div> 
                    
                </div>
                <div class="flex items-center space-x-4">
                    <button type="submit" classNamen="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update product</button>
                    <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                        <svg className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Delete
                    </button>
                </div>
            </form>
            )}
        </div>
    </div>
</div>
{/* <!-- Read modal --> */}
<div id="readProductModal" className={`hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 ${isPreviewModalOpen ? '' : 'hidden'}`}>
    <div className="relative p-4 w-full max-w-xl">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <div className="flex justify-between mb-4 rounded-t sm:mb-5">
                <div className="text-lg text-gray-900 md:text-xl dark:text-white">
                    <h3 className="font-semibold">{currentPreviewedUser && currentPreviewedUser.name}</h3>
                    <p className="font-bold">{currentPreviewedUser && currentPreviewedUser.email}</p>
                </div>
                <div>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsPreviewModalOpen(false)}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
            </div>
            <dl>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{currentPreviewedUser && currentPreviewedUser.details}</dd>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Category</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{currentPreviewedUser && currentPreviewedUser.category}</dd>
            </dl>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <button type="button" className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        Edit
                    </button>
                    <button type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Preview</button>
                </div>
                <button type="button" className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                    <svg aria-hidden="true" className="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
</div>

{/* <!-- Delete modal --> */}
{/*
<div id="deleteModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
        {/* <!-- Modal content --> */}{/*
        <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button type="button" class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
            <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
            <div class="flex justify-center items-center space-x-4">
                <button data-modal-toggle="deleteModal" type="button" class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                <button type="submit" class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">Yes, I'm sure</button>
            </div>
        </div>
    </div>
            </div>*/}
</div> 
  )
}

export default Users;