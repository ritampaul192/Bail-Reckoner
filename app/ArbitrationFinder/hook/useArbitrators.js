'use client';
import { useEffect, useState } from 'react';

export default function useArbitrators(perPage = 24) {
  const [arbitrators, setArbitrators] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    rating: '',
    experience: '',
    language: '',
  });

  const [LOCATIONS, setLOCATIONS] = useState([]);
  const [RATINGS] = useState([1, 2, 3, 4, 5]);
  const [EXPERIENCES] = useState([1, 5, 10, 15, 20]);
  const [LANGUAGES, setLANGUAGES] = useState([]);
  const [totalFiltered, setTotalFiltered] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch('/api/Arbitrator', { signal: controller.signal });
        const data = await res.json();

        if (!data.success) throw new Error('Failed to fetch arbitrators');

        const all = data.arbitrators || [];

        const filtered = all.filter((a) =>
          (!filters.location || a.location === filters.location) &&
          (!filters.rating || a.rating >= Number(filters.rating)) &&
          (!filters.experience || a.experience >= Number(filters.experience)) &&
          (!filters.language || (a.languages || []).includes(filters.language))
        );

        setTotalFiltered(filtered.length);

        const paginated = filtered.slice((page - 1) * perPage, page * perPage);
        setArbitrators(paginated);
        setTotalPages(Math.ceil(filtered.length / perPage));

        setLOCATIONS([...new Set(all.map((a) => a.location).filter(Boolean))]);

        const languageSet = new Set();
        all.forEach((a) => (a.languages || []).forEach((lang) => languageSet.add(lang)));
        setLANGUAGES([...languageSet]);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error fetching arbitrators:', err);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [filters, page, perPage]);

  return {
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
  };
}
