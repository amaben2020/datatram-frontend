'use client';

import { useClerkToken } from '../context/TokenContext';
import ConnectionOnboardingAnimation from '@/components/organisms/connector';

const Page = () => {
  const { token, isLoading } = useClerkToken();
  console.log(token);

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
      <div className="w-[80vw]">
        <div className="onboarding-welcome">
          <ConnectionOnboardingAnimation />
        </div>
      </div>
    </section>
  );
};

export default Page;
