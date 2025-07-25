import Image from 'next/image';

export default function Wishlist({ wishlist, setWishlist, handleRemoveWishlist }) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="text-gray-500 text-center py-20">
          No arbitrators in your wishlist.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {wishlist.map((a) => {
            const id = a._id?.toString() || a.id;
            return (
              <div key={id} className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <>
                  <div className="flex items-center gap-4">
                        <Image
                          src={a.avatar}
                          alt={a.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '50%' }}
                          unoptimized={true}
                        />
                      {a.avatar ? (
                        <Image
                          src={a.avatar}
                          alt={a.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '50%' }}
                          unoptimized={true}
                        />
                      ) : (
                        <span role="img" aria-label="profile">👤</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">{a.name || 'Unnamed'}</div>
                      <div className="text-sm text-gray-500">{a.title || 'Arbitrator'}</div>
                      <div className="text-xs text-gray-400">
                        {a.location || 'Unknown'} • {a.rating || 0}★ • {a.casesResolved || 0}+ cases
                      </div>
                    </div>
                  <button
                    onClick={() => handleRemoveWishlist(id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
