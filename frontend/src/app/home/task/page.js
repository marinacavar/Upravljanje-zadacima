"use client";
import React from 'react'
import Sidebar from '../sidebar';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";

import axios from 'axios';


const Tasks = () => {
    
    const [currentTask, setCurrentTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [openDropdowns, setOpenDropdowns] = useState(Array(tasks.length).fill(false));
    const dropdownRefs = useRef([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // update
    const [updatedTask, setUpdatedTask] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');
    //read
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [currentPreviewedTask, setCurrentPreviewedTask] = useState(null);
    const [cameFromReadModal, setCameFromReadModal] = useState(false);

    const [username, setUsername] = useState('');
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        console.log('Stored Username:', storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (username || searchQuery) {
            fetchTasks();
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [username, searchQuery]);
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/task?search=${searchQuery}`);
            const filteredTasks = response.data.filter(task => {
                if (Array.isArray(task.user)) {
                    const shouldInclude = task.user.some(user => user.includes(username));
                    return shouldInclude;
                } else {
                    return false; 
                }
            });
            setTasks(filteredTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    
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
    

    //edit
    
    const handleEditClick = (task, cameFromRead = false) => {
        console.log("Edit button clicked, task:", task); 
        setCurrentTask(task); 
        setUpdatedTask(task); 
        setIsModalOpen(true); 
        setIsPreviewModalOpen(false);
        setCameFromReadModal(cameFromRead);
        
        
    };
    
    const handleInputChange = (event) => {
        console.log("Naziv svojstva:", event.target.name);
        console.log("Vrijednost svojstva:", event.target.value);
    
        
        console.log("Prije ažuriranja, updatedTask:", updatedTask);
    
        
        setUpdatedTask({
            ...updatedTask,
            [event.target.name]: event.target.value
        });
    
        
        console.log("Nakon ažuriranja, updatedTask:", updatedTask);
    };
    
    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/task/${currentTask._id}`, updatedTask);
            setTasks(tasks.map(task => task._id === currentTask._id ? response.data : task));
            setIsModalOpen(false);
            setCurrentPreviewedTask(response.data);
            setUpdateSuccessMessage('Task updated successfully!');
            setTimeout(() => {
                setUpdateSuccessMessage('');
            }, 5000);
            
            if (cameFromReadModal) {
                setIsPreviewModalOpen(true);
                setCameFromReadModal(false);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        return `${day}.${month}.${year}.`;
    }

    
    //read

    const handlePreviewClick = (task) => {
        setCurrentPreviewedTask(task);
        setIsPreviewModalOpen(true);
        setIsModalOpen (false);
    };

  
  return (
    <div className='max-w-none flex-col lg:flex-row lg:items-start lg:justify-start flex-grow'>
    <div className="lg:w-1/5">
    <Sidebar  />
    </div>
            <section className="bg-gray-100 dark:bg-gray-900 p-4 md:p-10 lg:p-20 antialiased flex-grow mt-4">
                <div className="mx-auto px-4 lg:px-12">
                    <div className="flex-1 ml-0 md:ml-16 lg:ml-48 lg:pl-2 pt-20 lg:pt-0">
                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                {/* Search form */}
                                <div className="w-full md:w-1/2">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                 type="text"
                                                 id="simple-search"
                                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                                 placeholder="Search"
                                                 value={searchQuery}
                                                 onChange={(e) => setSearchQuery(e.target.value)}
                                             />
                                        </div>
                                    </form>
                                </div>
                                {/* Buttons */}
                                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    {/* Dropdown menu */}
                                    {/* <div className="flex items-center space-x-3 w-full md:w-auto"> */}
                                    {/* <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button"> */}
                                        {/* <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> */}
                                            {/* <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /> */}
                                        {/* </svg> */}
                                        {/* Actions */}
                                    {/* </button> */}
                                    {/* <div id="actionsDropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"> */}
                                        {/* <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton"> */}
                                            {/* <li> */}
                                                {/* <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a> */}
                                            {/* </li> */}
                                        {/* </ul> */}
                                        {/* <div className="py-1"> */}
                                            {/* <a href="#" className ="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete all</a> */}
                                        {/* </div> */}
                                    {/* </div> */}
                                {/* </div> */}
                                    {/* Filter button */}
                                    {/* <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button"> */}
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor"> */}
                                            {/* <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /> */}
                                        {/* </svg> */}
                                        {/* Filter */}
                                        {/* <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> */}
                                            {/* <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /> */}
                                        {/* </svg> */}
                                    {/* </button> */}
                                    
                                    {/* <div id="filterDropdown" className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"> */}
                                        {/* <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h6> */}
                                        {/* <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton"> */}
                                            {/* <li className="flex items-center"> */}
                                               
                                            {/* </li> */}
                                        {/* </ul> */}
                                    {/* </div> */}
                                </div>
                            </div>
                            {/* Table */}
                            <div className="overflow-x-auto max-w-none">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-4 py-4 w-1/5 text-center">Task</th>
                                            <th scope="col" className="px-4 py-3 w-1/5 text-center">User</th>
                                            <th scope="col" className="px-4 py-3 w-1/5 text-center">Deadline</th>
                                            <th scope="col" className="px-4 py-3 w-1/5 text-center">Status</th>
                                            <th scope="col" className="px-4 py-3 w-1/5 text-center">
                                                <span className="sr-only text-right">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {currentTasks.map((task, index) => (
                                        <tr key={task._id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-normal dark:text-white text-center break-all overflow-auto">{task.tasks}</td>
                                            <td className="px-4 py-3 text-center break-all overflow-auto  ">{task.user}</td>
                                            <td className="px-4 py-3 text-center ">{formatDate(task.deadline)}</td>
                                            <td className="px-4 py-3 text-center ">{task.status}</td>
                                            <td className="px-4 py-3 items-center text-center" ref={(el) => (dropdownRefs.current[index] = el)}>
                                                <button
                                                    className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 "
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
                                                                    onClick={() => handleEditClick(task)}
                                                                >
                                                                    <FiEdit className="w-4 h-4 mr-2" />
                                                                    Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    onClick={() => handlePreviewClick(task)}
                                                                >
                                                                    <FaEye className="w-4 h-4 mr-2" />
                                                                    Preview
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
                                    Showing {indexOfFirstTask + 1}-{indexOfLastTask} of {tasks.length}
                                </span>
                                <ul className="inline-flex items-stretch -space-x-px">
                                    {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }).map((_, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => paginate(index + 1)}
                                                className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === index + 1 ? 'text-primary-600 bg-primary-100' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} ${index === 0 ? 'rounded-l-lg' : ''} ${index === Math.ceil(tasks.length / tasksPerPage) - 1 ? 'rounded-r-lg' : ''}`}
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
                                    



{/* <!-- Update modal --> */}
{isModalOpen && (
    
    <div id="updateProductModal" className={`${isModalOpen ? '' : 'hidden'} fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50`}>

        <div className="relative p-4 w-full max-w-2xl">
            {/* <!-- Modal content --> */}
            
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-blue-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Update </h3>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <IoMdClose className="w-5 h-5"/>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                {currentTask && (
                <form action="#" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                          <select id="status" name="status" value={updatedTask.status} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option value="Active">Active</option>
                            <option value="Done">Done</option>
                           </select>
                       </div>    
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blues-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Task</button>
                        <button type="button" 
                            onClick={() => {
                                handleDeleteClick(currentTask._id); 
                                setIsModalOpen(false);
                            }} 
                            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            < MdDelete className="w-5 h-5 mr-1.5 -ml-1" />
                            Delete
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    </div>
    
  )}
  <div>
        {updateSuccessMessage && (
            <div className="fixed top-0 right-0 mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded">
                {updateSuccessMessage}
            </div>
        )}
    </div>
{/* <!-- Read modal --> */}
<div id="readProductModal" className={`${isPreviewModalOpen ? '' : 'hidden'} fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50`}>
    <div className="relative p-4 w-full max-w-xl">
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Details</h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white" 
                        onClick={() => setIsPreviewModalOpen(false)}>
                    <IoMdClose className="w-5 h-5"/>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <dl>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Task</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 break-all overflow-auto">{currentPreviewedTask && currentPreviewedTask.tasks}</dd>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Users</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 break-all overflow-auto">{currentPreviewedTask && currentPreviewedTask.user}</dd>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Deadline</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 break-all overflow-auto">{currentPreviewedTask && formatDate (currentPreviewedTask.deadline)}</dd>
                <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Status</dt>
                <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 break-all overflow-auto">{currentPreviewedTask && currentPreviewedTask.status}</dd>
                
            </dl>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <button onClick={() => handleEditClick(currentPreviewedTask, true)} type="button" className="text-white inline-flex items-center bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <FiEdit className="mr-1 -ml-1 w-5 h-5" />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</div> 
    );
}

export default Tasks;