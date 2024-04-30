"use client"
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/forgetPassword', { email });
      setMessage('Link for resetting your password has been sent to your email.');
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-20">
        <div className="text-left font-bold">
          <span className="text-blue-800">Task</span>Management
        </div>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Reset Password</h2>
        <form onSubmit={submitForm} autoComplete='off'>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="border-2 rounded-full px-12 py-2 inline-block font-semibold" type="submit">
              Reset
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
