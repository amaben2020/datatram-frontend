'use client';

import { useClerkToken } from '../context/TokenContext';

import ConnectionOnboardingAnimation from '@/components/organisms/connector';

const Page = () => {
  // const token = useAuth();
  // useEffect(() => {
  //   token.getToken().then((token) => console.log(token));
  // }, []);
  const { token, isLoading } = useClerkToken();
  console.log(token);

  if (isLoading) return <div>Loading...</div>;

  return (
    // <section className="min-h-screen flex justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
    //   <ConnectionOnboardingAnimation />
    // </section>
    <section className="w-[80vw] min-h-screen flex justify-center items-center">
      <ConnectionOnboardingAnimation />
    </section>
  );
};

export default Page;
