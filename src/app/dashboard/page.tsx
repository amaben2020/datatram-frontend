'use client';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { useClerkToken } from '../context/TokenContext';

const Page = () => {
  // const token = useAuth();
  // useEffect(() => {
  //   token.getToken().then((token) => console.log(token));
  // }, []);
  const { token, isLoading } = useClerkToken();
  console.log(token);

  if (isLoading) return <div>Loading...</div>;
  return <div>page</div>;
};

export default Page;
