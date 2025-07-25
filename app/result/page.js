import React, { Suspense } from 'react';
import Result from './Result';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading...</div>}>
      <Result />
    </Suspense>
  );
}