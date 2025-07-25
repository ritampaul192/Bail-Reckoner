import React, { useState, useEffect } from 'react';
import API from '../api';

export default function AdvocateForm() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]  bg-white ">
      <div className="w-full max-w-md">
        <form className=" p-4 border  rounded bg-white shadow">
        <h2 className="text-xl mb-2">Add Advocate</h2>

        <input name="caseTitle"  placeholder="Case Title" className="mb-2 p-2 w-full border rounded" />
        <input name="caseNumber" placeholder="Case Number" className="mb-2 p-2 w-full border rounded" />

        <select name="advocate" className="mb-2 p-2 w-full border rounded">
          <option value="">Select Advocate</option>
          
        </select>

        <select name="status" className="mb-2 p-2 w-full border rounded">
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        
        <select name="status" className="mb-2 p-2 w-full border rounded">
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select name="status" className="mb-2 p-2 w-full border rounded">
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <input type="date" name="hearingDate" className="mb-2 p-2 w-full border rounded" />
        <textarea name="description" placeholder="Description" className="mb-2 p-2 w-full border rounded" />

        <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>
    </div>
  );
}
