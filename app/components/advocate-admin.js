'use client';

import { useEffect, useState } from 'react';
import { MdVerified } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { ALL_COURTS } from '../AdvocateFinder/data/advocates';
function getStarColor(rating) {
  if (rating > 4.5) return 'text-green-500';
  if (rating >= 4) return 'text-yellow-400';
  if (rating >= 3.5) return 'text-orange-400';
  return 'text-red-500';
}

function VerifiedBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
      <MdVerified className='text-blue-400' />
      Verified
    </span>
  );
}

export default function AdvocateManager() {
  const [advocates, setAdvocates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [otherLanguage, setOtherLanguage] = useState('');
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [uniquePracticeAreas, setUniquePracticeAreas] = useState([]);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState([]);
  const [showOtherPractice, setShowOtherPractice] = useState(false);
  const [otherPractice, setOtherPractice] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAdvocateId, setEditAdvocateId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    city: '',
    court: '',
    rating: '',
    experience: '',
    specialization: '',
    photo: '',
    languages: '',
    barId: '',
    email: '',
    whatsapp: '',
    verified: false,
    practiceAreas: '',
    bio: '',
  });

  const fetchAdvocates = async () => {
    try {
      const res = await fetch('/api/Advocate');
      const data = await res.json();
      const advList = data.advocates || [];
      setAdvocates(advList);

      // Extract unique cities
      const cities = [...new Set(advList.map((a) => a.city).filter(Boolean))];
      setUniqueCities(cities);
      const allLanguages = advList.flatMap((a) => a.languages || []);
      const uniqueLangs = [...new Set(allLanguages.map(l => l.trim()).filter(Boolean))];
      setUniqueLanguages(uniqueLangs);
      const allPractice = advList.flatMap((a) => a.practiceAreas || []);
      const uniquePractice = [...new Set(allPractice)];
      setUniquePracticeAreas(uniquePractice);

    } catch (err) {
      console.error('Failed to load advocates:', err);
    }
  };


  useEffect(() => {
    fetchAdvocates();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      _id: editAdvocateId,
      languages: [
        ...selectedLanguages.filter(lang => lang !== 'Other'),
        ...(showOtherLanguage && otherLanguage ? [otherLanguage.trim()] : []),
      ],
      practiceAreas: form.practiceAreas,
      court: form.court,
      experience: Number(form.experience),
      rating: Number(form.rating),
    };

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/Advocate', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
      setShowForm(false);
      setForm({
        name: '',
        city: '',
        court: [],
        rating: '',
        experience: '',
        specialization: '',
        photo: '',
        languages: '',
        barId: '',
        email: '',
        whatsapp: '',
        verified: false,
        practiceAreas: [],
        bio: '',
      });
      setSelectedLanguages([]);
      setOtherLanguage('');
      setIsEditMode(false);
      setEditAdvocateId(null);
      fetchAdvocates();
    } catch (err) {
      console.error('Error saving advocate:', err);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete advocate "${name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch('/api/Advocate/delete', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Advocate deleted successfully');
        fetchAdvocates();
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting advocate:', err);
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#2c3e50]">Advocate Directory</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-[#2c3e50] text-white px-4 py-2 rounded hover:bg-[#34495e]"
        >
          {showForm ? 'Close Form' : 'Add Advocate'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-6 bg-white p-4 rounded shadow text-gray-800">
          {[
            ['name', 'Full Name'],
            ['rating', 'Rating'],
            ['experience', 'Experience (years)'],
            ['specialization', 'Specialization'],
            ['photo', 'Photo URL'],
            ['barId', 'Bar ID'],
            ['email', 'Email'],
            ['whatsapp', 'WhatsApp Number'],
            ['bio', 'Bio'],
          ].map(([key, label]) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={label}
              className="border p-2 rounded"
              required={['name', 'email'].includes(key)}
            />
          ))}
          <label className="flex flex-col gap-1">
            <span className="font-medium">City</span>
            <select
              name="city"
              value={isOtherCity ? 'Other' : form.city}
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  setIsOtherCity(true);
                  setForm({ ...form, city: '' });
                } else {
                  setIsOtherCity(false);
                  setForm({ ...form, city: e.target.value });
                }
              }}
              className="border p-2 rounded"
              required
            >
              <option value="">Select City</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {isOtherCity && (
              <input
                type="text"
                name="city"
                value={form.city}
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
              {uniqueLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    className={`px-3 py-1 rounded-full border ${isSelected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        const updated = selectedLanguages.filter((l) => l !== lang);
                        setSelectedLanguages(updated);
                        if (lang === 'Other') {
                          setShowOtherLanguage(false);
                          setOtherLanguage('');
                        }
                      } else {
                        const updated = [...selectedLanguages, lang];
                        setSelectedLanguages(updated);
                        if (lang === 'Other') setShowOtherLanguage(true);
                      }
                    }}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            {showOtherLanguage && (
              <input
                type="text"
                placeholder="Enter custom language"
                value={otherLanguage}
                onChange={(e) => setOtherLanguage(e.target.value)}
                className="border p-2 rounded mt-2"
                required
              />
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium">Courts</span>
            <div className="flex flex-wrap gap-2">
              {ALL_COURTS.map((court) => {
                const isSelected = form.court.includes(court);
                return (
                  <button
                    type="button"
                    key={court}
                    className={`px-3 py-1 rounded-full border ${isSelected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    onClick={() => {
                      const updatedCourts = isSelected
                        ? form.court.filter((c) => c !== court)
                        : [...form.court, court];
                      setForm({ ...form, court: updatedCourts });
                    }}
                  >
                    {court}
                  </button>
                );
              })}
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Practice Areas</span>
            <div className="flex flex-wrap gap-2">
              {uniquePracticeAreas.map((area) => {
                const isSelected = selectedPracticeAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    className={`px-3 py-1 rounded-full border ${isSelected
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    onClick={() => {
                      const updated = isSelected
                        ? selectedPracticeAreas.filter((a) => a !== area)
                        : [...selectedPracticeAreas, area];
                      setSelectedPracticeAreas(updated);
                      setShowOtherPractice(updated.includes('Other'));
                    }}
                  >
                    {area}
                  </button>
                );
              })}
              {/* "Other" button */}
              <button
                type="button"
                className={`px-3 py-1 rounded-full border ${showOtherPractice
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                onClick={() => {
                  const updated = showOtherPractice
                    ? selectedPracticeAreas.filter((a) => a !== 'Other')
                    : [...selectedPracticeAreas, 'Other'];
                  setSelectedPracticeAreas(updated);
                  setShowOtherPractice(!showOtherPractice);
                }}
              >
                Other
              </button>
            </div>

            {showOtherPractice && (
              <input
                type="text"
                placeholder="Enter custom practice area"
                value={otherPractice}
                onChange={(e) => setOtherPractice(e.target.value)}
                className="border p-2 rounded mt-2"
                required
              />
            )}
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="verified"
              checked={form.verified}
              onChange={handleChange}
            />
            Verified
          </label>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {isEditMode ? 'Update Advocate' : 'Save Advocate'}
          </button>

        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {advocates.map((adv) => (
          <div key={adv._id} className="bg-white p-4 rounded shadow flex flex-col justify-between ">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border text-gray-500 text-4xl">
                <CgProfile />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  {adv.name} {adv.verified && <VerifiedBadge />}
                </h2>
                <p className="text-sm text-gray-700 truncate">{adv.specialization}</p>
                <p className="text-sm text-gray-500">Experience: {adv.experience} yrs</p>
                <p className="text-sm text-gray-500">
                  Rating: <span className={getStarColor(adv.rating)}>{adv.rating.toFixed(1)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Court:{' '}
                  {Array.isArray(adv.court)
                    ? adv.court.join(', ')
                    : adv.court || 'N/A'}
                </p>

              </div>
            </div>
            <div className="text-sm text-gray-800 mb-1">Languages: {(adv.languages || []).join(', ')}</div>
            <div className="text-sm text-gray-800 mb-1">Practice Areas: {(adv.practiceAreas || []).join(', ')}</div>
            <div className="text-sm text-gray-800 mb-1">City: {adv.city}</div>
            <div className="text-sm text-gray-800 mb-1">Bar ID: {adv.barId}</div>
            <div className="text-sm text-gray-800 mb-1">Email: {adv.email}</div>
            <div className="text-sm text-gray-800 mb-1">WhatsApp: {adv.whatsapp}</div>
            <div className="text-sm text-gray-800 mb-2">Bio: {adv.bio}</div>
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => {
                  setForm({
                    ...adv,
                    court: Array.isArray(adv.court) ? adv.court : [adv.court],
                    languages: '',
                    practiceAreas: Array.isArray(adv.practiceAreas) ? adv.practiceAreas : [],
                  });
                  setSelectedLanguages(adv.languages || []);
                  setEditAdvocateId(adv._id);
                  setIsEditMode(true);
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 self-start"
              >
                Edit
              </button>


              <button
                onClick={() => handleDelete(adv._id, adv.name)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 self-start"
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
