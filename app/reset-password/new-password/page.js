import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const NewPasswordForm = dynamic(() => import('./NewPasswordForm'), {
  ssr: false, // optional but helps ensure full client-side behavior
});

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading reset form...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}
