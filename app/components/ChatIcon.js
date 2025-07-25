import React from 'react'
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { useRouter } from 'next/navigation';

const ChatIcon = () => {
    const router = useRouter();
    const handleInputMessageClick = () => {
        router.push('/messages');
    };
    return (
        <button
            onClick={handleInputMessageClick}
            className='shadow-xl shadow-gray-700 p-2 sm:p-5 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 fixed bottom-3 right-3 rounded-full'>
            <MdOutlineMarkUnreadChatAlt className='text-white size-5' />
        </button>
    )
}

export default ChatIcon
