'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

const BusStopAutocomplete = ({ busStops, onSelectBusStop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredBusStops = useMemo(() => {
    if (!searchTerm) return [];
    
    return busStops
      .filter(stop => 
        stop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stop.id.toString().includes(searchTerm)
      )
      .slice(0, 10); // Increased to show more results
  }, [busStops, searchTerm]);

  // Handle click outside to close dropdown
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 pr-8 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
        />
        <Search 
          className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-white" 
          size={16} 
        />
        {searchTerm && (
          <X 
            onClick={clearSearch}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:text-gray-300" 
            size={16} 
          />
        )}
      </div>

      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredBusStops.length > 0 ? (
            <ul>
              {filteredBusStops.map((stop) => (
                <li 
                  key={stop.id}
                  onClick={() => handleSelectBusStop(stop)}
                  className="px-3 sm:px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-sm sm:text-base"
                >
                  <MapPin size={16} className="mr-2 text-[#00f5d0]" />
                  <div>
                    <span className="font-medium text-white">{stop.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-400 text-sm">
              No bus stops found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusStopAutocomplete;