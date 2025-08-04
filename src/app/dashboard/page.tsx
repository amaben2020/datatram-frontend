'use client';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { useClerkToken } from '../context/TokenContext';
import { SidebarComponent } from '@/components/organisms/sidebar';
import Link from 'next/link';

const Page = () => {
  // const token = useAuth();
  // useEffect(() => {
  //   token.getToken().then((token) => console.log(token));
  // }, []);
  const { token, isLoading } = useClerkToken();
  console.log(token);

  if (isLoading) return <div>Loading...</div>;
  // return <SidebarComponent />;
  return (
    <>
      {/* <Dashboard /> */}
      <h1>Dashboard</h1>
      <Link href="/dashboard/connections">Conn</Link>
    </>
  );
};

export default Page;
