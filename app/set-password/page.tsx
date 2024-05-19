import { Suspense } from 'react';
import SetPassword from './set-password';

const Page = () => (
  <Suspense fallback={null}>
    <SetPassword />
  </Suspense>
);

export default Page;
