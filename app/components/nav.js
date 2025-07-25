import React from 'react';

export default function Nav({ onTrigger }) {
  const handleClick = () => {
    if (onTrigger) {
      onTrigger('Edit Profile Clicked!');
    }
  };

  return (
    <button onClick={handleClick}>
      Edit Profile
    </button>
  );
}
