import React from 'react'
import Link from 'next/link'

const AdminNav = () => {
  return (<div className='p-5 text-center bg-teal-300 font-medium w-full h-fit text-black'>
                    <h1 className='text-2xl font-bold'>
                        ADMIN DASHBOARD
                    </h1>
                    <ul className="w-full justify-evenly flex flex-col pt-4 font-medium text-xl text-gray-700 lg:flex-row lg:space-x-8 lg:mt-0">
                        <li>
                            <Link href={'/'}
                                className="block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-indigo-600 lg:p-0"
                            >
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}
                                className="block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-indigo-600 lg:p-0"
                            >
                                Update Advocate
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}
                                className="block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-indigo-600 lg:p-0"
                            >
                                Update Arbitration
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'}
                                className="block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-indigo-600 lg:p-0"
                            >
                                Manage Messages
                            </Link>
                        </li>

                        <li>
                            <Link href={'/Home'}
                                className="block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-indigo-600 lg:p-0"
                            >
                                Back To Home
                            </Link>
                        </li>
                    </ul>
                </div>)
}

export default AdminNav
