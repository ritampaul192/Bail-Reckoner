import React, { Suspense } from 'react';
import NewPasswordForm from './NewPasswordForm';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading reset form...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}