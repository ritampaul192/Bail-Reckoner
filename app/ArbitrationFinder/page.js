'use client';

import { useState, useEffect } from 'react';
import Wishlist from '../components/Wishtlist';
import ApplicationDrawer from '../components/ArbitApplicationForm';
import ArbitratorCard from '../components/ArbitratorCard';
import ArbitratorProfileModal from '../components/ArbitratorModal';
import Pagination from '../components/ArbitPagination';
import StarRating from '../components/StarRating';
import useArbitrators from './hook/useArbitrators';
import ArbitrationNav from '../components/newNav';
import ApplicationsLog from '../components/Application';
import { useRouter } from 'next/navigation';

export default function ArbitrationFinderPage() {
    const router = useRouter();
    const [view, setView] = useState('search');
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [username, setUsername] = useState('');
    const [applicant, setApplicant] = useState('');
    const [userId, setUserId] = useState('');

    const [selectedArb, setSelectedArb] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wishlistToast, setWishlistToast] = useState(false);
    const [submittedApps, setSubmittedApps] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.replace('/signin');
            return;
        }

        const parsedUser = JSON.parse(user);
        const un = parsedUser.username;
        const uid = parsedUser.userId || '';

        setUsername(un);
        setUserId(uid);

        const namefull = un
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        setApplicant(namefull);

        fetchWishlist(uid);
    }, []);

    const fetchWishlist = async (id) => {
        try {
            const res = await fetch('/api/Arbitrator/wishlist', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id }),
            });

            if (!res.ok) return;

            const text = await res.text();
            if (!text) return;

            const data = JSON.parse(text);
            if (data.success) {
                setWishlist(data.arbitrators);
                setWishlistIds(data.arbitrators.map(arb => arb._id));
            }
        } catch (err) {
            console.error('Error parsing wishlist response:', err);
        }
    };

    const handleAddWishlist = async (arbitrator) => {
        try {
            const res = await fetch('/api/Arbitrator/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    arbitratorId: arbitrator._id,
                    userId,
                }),
            });

            const text = await res.text();
            if (!text) return;

            const data = JSON.parse(text);
            if (data.success) {
                setWishlist(prev => [...prev, arbitrator]);
                setWishlistIds(prev => [...prev, arbitrator._id]);
                setWishlistToast(true);
                setTimeout(() => setWishlistToast(false), 1500);
            }
        } catch (err) {
            console.error('Error adding to wishlist:', err);
        }
    };
    const handleRemoveWishlist = async (arbitratorId) => {
        try {
            const res = await fetch('/api/Arbitrator/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    arbitratorId,
                    userId,
                }),
            });

            const text = await res.text();
            if (!text) return;
            const data = JSON.parse(text);

            if (data.success) {
                setWishlist(prev => prev.filter(a => (a._id || a.id) !== arbitratorId));
                setWishlistIds(prev => prev.filter(id => id !== arbitratorId));
            }
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        }
    };


    const {
        arbitrators,
        totalPages,
        page,
        setPage,
        filters,
        setFilters,
        LOCATIONS,
        RATINGS,
        EXPERIENCES,
        LANGUAGES,
        totalFiltered,
    } = useArbitrators(24);

    return (
        <div className="min-h-screen bg-[#f9f9f9] pb-10">
            <ArbitrationNav currentView={view} setView={setView} />
            <div className="pt-24 max-w-6xl mx-auto px-2 md:px-6 text-gray-700">
                {view === 'search' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/90 p-4 rounded-2xl shadow">
                            <select className="border rounded-lg px-3 py-2 flex-1" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
                                <option value="">Location</option>
                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                            <select className="border rounded-lg px-3 py-2 flex-1" value={filters.rating} onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))}>
                                <option value="">Rating</option>
                                {RATINGS.map(r => <option key={r} value={r}>{r}+</option>)}
                            </select>
                            <select className="border rounded-lg px-3 py-2 flex-1" value={filters.experience} onChange={e => setFilters(f => ({ ...f, experience: e.target.value }))}>
                                <option value="">Experience</option>
                                {EXPERIENCES.map(e => <option key={e} value={e}>{e}+ yrs</option>)}
                            </select>
                            <select className="border rounded-lg px-3 py-2 flex-1" value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
                                <option value="">Language</option>
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* Arbitrator Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {arbitrators.length === 0 && (
                                <div className="col-span-full text-center text-gray-400 py-10">No arbitrators found.</div>
                            )}
                            {arbitrators.map((arbitrator, idx) => (
                                <ArbitratorCard
                                    key={idx}
                                    arbitrator={arbitrator}
                                    onClick={() => setSelectedArb(arbitrator)}
                                    StarRating={StarRating}
                                />
                            ))}
                        </div>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        <div className="text-xs text-gray-400 mt-2 text-center">
                            Showing {arbitrators.length} of {totalFiltered} arbitrators
                        </div>
                    </>
                )}

                {view === 'wishlist' &&
                    <Wishlist
                        wishlist={wishlist}
                        setWishlist={setWishlist}
                        handleRemoveWishlist={handleRemoveWishlist}
                    />
                }
                {view === 'application' && <ApplicationsLog applicant={applicant} />}
            </div>

            {/* Modals */}
            <ArbitratorProfileModal
                arbitrator={selectedArb}
                onClose={() => setSelectedArb(null)}
                onApply={() => setShowForm(true)}
                onAddWishlist={handleAddWishlist}
                isWishlisted={selectedArb && wishlistIds.includes(selectedArb._id)}
                StarRating={StarRating}
            />

            <ApplicationDrawer
                open={showForm}
                arbitrator={selectedArb}
                onClose={() => setShowForm(false)}
                onSubmit={(data) => {
                    setSubmittedApps(prev => [...prev, data]);
                    setShowForm(false);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 2000);
                }}
                username={username}
            />

            {/* Toasts */}
            {success && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition">
                    Application submitted!
                </div>
            )}
            {wishlistToast && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition">
                    Added to wishlist!
                </div>
            )}
        </div>
    );
}
