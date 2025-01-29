'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Search, MapPin, X } from 'lucide-react';

const BusStopAutocomplete = ({ busStops, onSelectBusStop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredBusStops = useMemo(() => {
    if (!searchTerm) return [];
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return busStops
      .filter(stop => {
        const matchesName = stop.name.toLowerCase().includes(normalizedSearchTerm);
        const matchesId = stop.id.toString().includes(normalizedSearchTerm);
        const matchesLocation = stop.location 
          ? stop.location.toLowerCase().includes(normalizedSearchTerm)
          : false;
        return matchesName || matchesId || matchesLocation;
      })
      .sort((a, b) => {
        const aStartsWithTerm = a.name.toLowerCase().startsWith(normalizedSearchTerm);
        const bStartsWithTerm = b.name.toLowerCase().startsWith(normalizedSearchTerm);
        if (aStartsWithTerm && !bStartsWithTerm) return -1;
        if (!aStartsWithTerm && bStartsWithTerm) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);
  }, [busStops, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBusStop = (stop) => {
    setSelectedBusStop(stop);
    setSearchTerm(stop.name);
    setIsDropdownOpen(false);
    onSelectBusStop(stop.id);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedBusStop(null);
    onSelectBusStop(null);
    inputRef.current.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input 
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (filteredBusStops.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder="Search Bus Stops"
          className="w-full p-4 pl-12 pr-10 bg-slate-900 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 border-2 border-slate-700 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isDropdownOpen && filteredBusStops.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-20 w-full bg-slate-900 rounded-xl border-2 border-slate-700 shadow-xl"
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            top: 'calc(100% + 0.5rem)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#475569 #1e293b'
          }}
        >
          <ul>
            {filteredBusStops.map((stop) => (
              <li 
                key={stop.id}
                onClick={() => handleSelectBusStop(stop)}
                className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex items-center group transition-colors"
              >
                <MapPin size={18} className="mr-3 text-cyan-400 group-hover:text-cyan-300 flex-shrink-0" />
                <span className="text-white group-hover:text-cyan-300 transition-colors truncate">
                  {stop.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function StudentForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [year, setYear] = useState('');
  const [busStops, setBusStops] = useState([]);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    year: '',
    busStop: ''
  });

  useEffect(() => {
    async function fetchBusStops() {
      try {
        const response = await fetch('/api/bus-stops');
        const data = await response.json();
        setBusStops(data);
      } catch (error) {
        console.error('Failed to fetch bus stops', error);
      }
    }
    fetchBusStops();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      year: '',
      busStop: ''
    };

    if (!name.trim()) newErrors.name = 'Name is required';
    
    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!year) newErrors.year = 'Please select a year';
    if (!selectedBusStop) newErrors.busStop = 'Please select a bus stop';

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          year,
          busStopId: selectedBusStop
        })
      });

      if (!response.ok) throw new Error('Failed to add student');

      setName('');
      setPhone('');
      setYear('');
      setSelectedBusStop(null);
      setErrors({ name: '', phone: '', year: '', busStop: '' });
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full p-4 bg-slate-900 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 border-2 border-slate-700 transition-all duration-200";
  const errorClasses = "text-red-400 text-sm mt-2 ml-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="w-full py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Image src="/logo2.png" alt="Left Logo" width={120} height={40} className="w-24 md:w-32" />
          <h1 className="text-4xl font-hacked md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Hackerz Forms
          </h1>
          <Image src="/logo1.png" alt="Right Logo" width={120} height={40} className="w-24 md:w-32" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 min-h-[700px]">
          {/* Form Header */}
          <div className="p-8 pb-0">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Bus Route Details
            </h2>
          </div>

          {/* Form Content - Separate scrollable container with more padding */}
          <div className="p-8 pt-4 pb-12 overflow-visible">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student Name"
                  className={inputClasses}
                />
                {errors.name && <p className={errorClasses}>{errors.name}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className={inputClasses}
                />
                {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
              </div>

              <div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClasses}
                >
                  <option value="" className="bg-slate-900">Select Year</option>
                  <option value="I" className="bg-slate-900">I</option>
                  <option value="II" className="bg-slate-900">II</option>
                  <option value="III" className="bg-slate-900">III</option>
                  <option value="IV" className="bg-slate-900">IV</option>
                </select>
                {errors.year && <p className={errorClasses}>{errors.year}</p>}
              </div>

              <div className="relative">
                <BusStopAutocomplete
                  busStops={busStops}
                  onSelectBusStop={(stopId) => setSelectedBusStop(stopId)}
                />
                {errors.busStop && <p className={errorClasses}>{errors.busStop}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 mt-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}