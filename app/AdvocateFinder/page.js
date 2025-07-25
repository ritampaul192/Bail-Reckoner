"use client"
import React, { useState, useEffect } from 'react'
import AdvocateCard, { VerifiedBadge } from '../components/AdvocateCard'
import AdvocateModal from '../components/AdvocateModal'
import Spinner from '../components/Spinner'
import SkeletonCard from '../components/SkeletonCard'
import Pagination from '../components/Pagination'
import StarRating from '../components/StarRating'
import { ALL_COURTS, ALL_PRACTICE_AREAS } from './data/advocates'



const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'rating-desc', label: 'Rating (High to Low)' },
  { value: 'rating-asc', label: 'Rating (Low to High)' },
  { value: 'exp-desc', label: 'Experience (High to Low)' },
  { value: 'exp-asc', label: 'Experience (Low to High)' },
]

function App() {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCourt, setSelectedCourt] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [modalAdvocate, setModalAdvocate] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [page, setPage] = useState(1)
  const [pageLoading, setPageLoading] = useState(false)
  const pageSize = 25
  const [advoct, setAdvoct] = useState([])

  const cities = [...new Set(advoct.map(a => a.city))]
  const courts = ALL_COURTS
  const ratings = [5, 4.5, 4, 3.5, 3]

  useEffect(() => {
    const fetchAdvocates = async () => {
      const res = await fetch('/api/Advocate');
      const data = await res.json();
      if (data.success) setAdvoct(data.advocates);
    };

    fetchAdvocates();
  }, []);

  let filteredAdvocates = advoct.filter(a =>
    (!selectedCity || a.city === selectedCity) &&
    (!selectedCourt || a.court === selectedCourt) &&
    (!selectedRating || a.rating >= Number(selectedRating))
  )

  // Sorting logic
  if (sortBy === 'rating-desc') filteredAdvocates = [...filteredAdvocates].sort((a, b) => b.rating - a.rating)
  if (sortBy === 'rating-asc') filteredAdvocates = [...filteredAdvocates].sort((a, b) => a.rating - b.rating)
  if (sortBy === 'exp-desc') filteredAdvocates = [...filteredAdvocates].sort((a, b) => b.experience - a.experience)
  if (sortBy === 'exp-asc') filteredAdvocates = [...filteredAdvocates].sort((a, b) => a.experience - b.experience)

  // Modal loading animation
  const handleCardClick = (advocate) => {
    setModalLoading(true)
    setModalAdvocate(null)
    setTimeout(() => {
      setModalAdvocate(advocate)
      setModalLoading(false)
    }, 500) // Simulate loading
  }

  const totalPages = Math.ceil(filteredAdvocates.length / pageSize) || 1
  const paginatedAdvocates = filteredAdvocates.slice((page - 1) * pageSize, page * pageSize)

  // For grid stability: always render pageSize items (real, skeleton, or invisible)
  let gridItems = []
  if (pageLoading) {
    gridItems = Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
  } else if (paginatedAdvocates.length === 0) {
    gridItems = [<div key="empty" className="col-span-full text-center text-gray-500">No advocates found.</div>]
    for (let i = 1; i < pageSize; i++) gridItems.push(<div key={`empty-${i}`} className="h-full aspect-[3/4] invisible" aria-hidden="true" />)
  } else {
    gridItems = paginatedAdvocates.map(advocate => (
      <AdvocateCard key={advocate.id} advocate={advocate} onClick={() => handleCardClick(advocate)} />
    ))
    for (let i = paginatedAdvocates.length; i < pageSize; i++) gridItems.push(<div key={`placeholder-${i}`} className="h-full aspect-[3/4] invisible" aria-hidden="true" />)
  }

  // Reset to page 1 when filters/sort change
  React.useEffect(() => {
    setPage(1)
  }, [selectedCity, selectedCourt, selectedRating, sortBy])

  // Page loading animation
  const handlePageChange = (newPage) => {
    if (newPage === page) return
    setPageLoading(true)
    setTimeout(() => {
      setPage(newPage)
      setPageLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen w-[100vw] bg-[#f9f9f9] p-4">
      <div className="w-full px-0 md:px-8 xl:px-32 2xl:px-64 mx-auto">
        <h1 className="p-4 bg-[#2c3e50] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-white font-bold text-xl my-2">Advocate Finder<span className='text-[#e74c3c] text-sm font-extralight'>~powered by BailSetu</span></h1>
        {/* Filter Panel */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#fff] p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <select
            className="border border-[#ecf0f1] rounded p-2 flex-1 text-[#34495e] bg-[#f9f9f9] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            <option value="" className="text-[#34495e]">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city} className="text-[#34495e]">{city}</option>
            ))}
          </select>
          <select
            className="border border-[#ecf0f1] rounded p-2 flex-1 text-[#34495e] bg-[#f9f9f9] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            value={selectedCourt}
            onChange={e => setSelectedCourt(e.target.value)}
          >
            <option value="" className="text-[#34495e]">All Courts</option>
            {courts.map(court => (
              <option key={court} value={court} className="text-[#34495e]">{court}</option>
            ))}
          </select>
          <select
            className="border border-[#ecf0f1] rounded p-2 flex-1 text-[#34495e] bg-[#f9f9f9] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            value={selectedRating}
            onChange={e => setSelectedRating(e.target.value)}
          >
            <option value="" className="text-[#34495e]">All Ratings</option>
            {ratings.map(rating => (
              <option key={rating} value={rating} className="text-[#34495e]">{rating}+</option>
            ))}
          </select>
          <select
            className="border border-[#ecf0f1] rounded p-2 flex-1 text-[#34495e] bg-[#f9f9f9] focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="text-[#34495e]">{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Advocate Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-all duration-300"
        >
          {gridItems}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <AdvocateModal advocate={modalAdvocate} onClose={() => setModalAdvocate(null)} loading={modalLoading} />
    </div>
  )
}

export default App