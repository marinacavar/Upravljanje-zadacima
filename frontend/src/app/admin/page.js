"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Sidebar from '../admin/sidebar';

export default function AdminPanel() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); 
    }
  }, []);

  return (
    <div>
      <Sidebar/>
    </div>
  );
}
