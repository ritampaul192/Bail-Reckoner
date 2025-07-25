'use client';

import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';

function getStarColor(rating) {
    if (rating > 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-500';
}

export default function ArbitratorManager() {
    const [arbitrators, setArbitrators] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [uniqueCities, setUniqueCities] = useState([]);
    const [uniqueLanguages, setUniqueLanguages] = useState([]);
    const [isOtherCity, setIsOtherCity] = useState(false);
    const [isOtherLanguage, setIsOtherLanguage] = useState(false);
    const [form, setForm] = useState({
        name: '',
        location: '',
        rating: '',
        experience: '',
        avatar: '',
        email: '',
        languages: [],
        casesResolved: '',
        title: '',
        bio: '',
    });
    const [languageInput, setLanguageInput] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchArbitrators();
    }, []);

    const fetchArbitrators = async () => {
        try {
            const res = await fetch('/api/Arbitrator');
            const data = await res.json();
            const list = data.arbitrators || [];
            setArbitrators(list);

            // Unique cities
            const cities = [...new Set(list.map(a => a.location).filter(Boolean))];
            setUniqueCities(cities);

            // ✅ Unique languages from arbitrators
            const allLanguages = list.flatMap(a => a.languages || []);
            const uniqueLangs = [...new Set(allLanguages)];
            setUniqueLanguages(uniqueLangs);
        } catch (err) {
            console.error('Failed to fetch arbitrators:', err);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditMode ? 'PUT' : 'POST';
        const payload = {
            ...form,
            _id: editId,
            experience: Number(form.experience),
            rating: Number(form.rating),
            casesResolved: Number(form.casesResolved),
        };

        try {
            const res = await fetch('/api/Arbitrator', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            alert(data.message);
            setShowForm(false);
            setForm({
                name: '',
                location: '',
                rating: '',
                experience: '',
                avatar: '',
                email: '',
                languages: [],
                casesResolved: '',
                title: '',
                bio: '',
            });
            setLanguageInput('');
            setIsOtherLanguage(false);
            setEditId(null);
            setIsEditMode(false);
            fetchArbitrators();
        } catch (err) {
            console.error('Error saving arbitrator:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Confirm delete?')) return;

        try {
            const res = await fetch('/api/Arbitrator/delete', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            alert(data.message);
            fetchArbitrators();
        } catch (err) {
            console.error('Error deleting arbitrator:', err);
        }
    };

    const toggleLanguage = (lang) => {
        setForm((prev) => {
            const updated = prev.languages.includes(lang)
                ? prev.languages.filter((l) => l !== lang)
                : [...prev.languages, lang];
            return { ...prev, languages: updated };
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[#2c3e50]">Arbitrator Directory</h1>
                <button
                    onClick={() => setShowForm((prev) => !prev)}
                    className="bg-[#2c3e50] text-white px-4 py-2 rounded hover:bg-[#34495e]"
                >
                    {showForm ? 'Close Form' : 'Add Arbitrator'}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-3 mb-6 bg-white p-4 rounded shadow text-gray-800"
                >
                    {['name', 'rating', 'experience', 'avatar', 'email', 'title', 'bio', 'casesResolved'].map((key) => (
                        <input
                            key={key}
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            className="border p-2 rounded"
                            required={['name', 'email'].includes(key)}
                        />
                    ))}

                    <label className="flex flex-col gap-1">
                        <span className="font-medium">Location</span>
                        <select
                            name="location"
                            value={isOtherCity ? 'Other' : form.location}
                            onChange={(e) => {
                                if (e.target.value === 'Other') {
                                    setIsOtherCity(true);
                                    setForm({ ...form, location: '' });
                                } else {
                                    setIsOtherCity(false);
                                    setForm({ ...form, location: e.target.value });
                                }
                            }}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Select City</option>
                            {uniqueCities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {isOtherCity && (
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Enter City Name"
                                className="border p-2 rounded mt-1"
                                required
                            />
                        )}
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="font-medium">Languages</span>
                        <div className="flex flex-wrap gap-2">
                            {uniqueLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => toggleLanguage(lang)}
                                    className={`px-3 py-1 rounded-full border ${form.languages.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setIsOtherLanguage((prev) => !prev)}
                                className="px-3 py-1 rounded-full border bg-gray-200 text-gray-800"
                            >
                                Other
                            </button>
                        </div>
                        {isOtherLanguage && (
                            <input
                                type="text"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (languageInput.trim()) {
                                            toggleLanguage(languageInput.trim());
                                            setLanguageInput('');
                                        }
                                    }
                                }}
                                placeholder="Enter other language and press Enter"
                                className="border p-2 rounded mt-2"
                            />
                        )}
                    </label>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {isEditMode ? 'Update Arbitrator' : 'Save Arbitrator'}
                    </button>
                </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                {arbitrators.map((arb) => (
                    <div key={arb._id} className="bg-white p-4 rounded shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border text-3xl">
                                <CgProfile />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    {arb.name}
                                </h2>
                                <p className="text-sm text-gray-700 truncate">{arb.title}</p>
                                <p className="text-sm text-gray-500">Experience: {arb.experience} yrs</p>
                                <p className="text-sm text-gray-500">
                                    Rating: <span className={getStarColor(arb.rating)}>{arb.rating?.toFixed(1)}</span>
                                </p>
                                <p className="text-sm text-gray-500">Languages: {arb.languages?.join(', ')}</p>
                                <p className="text-sm text-gray-800 mb-1">Cases Resolved: {arb.casesResolved}</p>
                            </div>
                        </div>
                        <div className="mt-2 flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setForm({
                                        ...arb,
                                        languages: arb.languages || [],
                                    });
                                    setEditId(arb._id);
                                    setIsEditMode(true);
                                    setShowForm(true);
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(arb._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}