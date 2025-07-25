'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ArbitratorProfileModal({
  arbitrator,
  onClose,
  onApply,
  StarRating,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!arbitrator) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      const id = parsed?.userId;
      if (!id) return;

      setUserId(id);

      const checkWishlist = async () => {
        try {
          const res = await fetch('/api/Arbitrator/wishlist', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: id }),
          });

          if (!res.ok) throw new Error('Failed to fetch wishlist');
          const data = await res.json();

          if (data.success) {
            const wishlistedIds = data.arbitrators.map((arb) => arb._id);
            setIsWishlisted(wishlistedIds.includes(arbitrator._id));
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      };

      checkWishlist();
    } catch (err) {
      console.error('Invalid user data in localStorage', err);
    }
  }, [arbitrator]);

  const handleAddWishlist = async () => {
    try {
      const res = await fetch('/api/Arbitrator/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arbitratorId: arbitrator._id,
          userId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsWishlisted(true);
      } else {
        alert('Failed to add to wishlist');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  if (!arbitrator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn scale-100 transition-transform">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="flex flex-col items-center gap-2">
            {arbitrator.avatar ? (
              <Image
                src={arbitrator.avatar}
                alt={arbitrator.name || 'Arbitrator Avatar'}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-full"
                style={{ objectFit: 'cover', borderRadius: '9999px' }}
                priority
              />
            ) : (
              <span role="img" aria-label="Profile">👤</span>
            )}
          </div>

          <h2 className="font-bold text-2xl text-gray-900">{arbitrator.name || 'Unnamed'}</h2>
          <p className="text-base text-gray-500">{arbitrator.title || 'Arbitrator'}</p>

          <div className="flex items-center gap-2 justify-center">
            {StarRating && <StarRating rating={arbitrator.rating || 0} />}
          </div>

          <p className="text-sm text-gray-400">
            {arbitrator.experience || 0} yrs exp • {(arbitrator.languages || []).join(', ')}
          </p>

          <p className="text-sm text-gray-700 text-center mb-3">
            {arbitrator.bio || 'No biography available.'}
          </p>

          <div className="flex gap-3 w-full">
            <a
              href={`mailto:${arbitrator.email}`}
              className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-center hover:bg-blue-200 transition"
            >
              📩 Email
            </a>
            <button
              onClick={onApply}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              📝 Apply
            </button>
          </div>

          <button
            className={`mt-3 w-full px-3 py-2 rounded-lg font-semibold transition ${
              isWishlisted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
            onClick={!isWishlisted ? handleAddWishlist : null}
            disabled={isWishlisted}
          >
            {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
          </button>
      </div>
    </div>
  );
}
