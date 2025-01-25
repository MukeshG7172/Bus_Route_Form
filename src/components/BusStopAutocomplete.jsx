'use client';
import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';

const BusStopAutocomplete = ({ busStops, onSelectBusStop }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBusStop, setSelectedBusStop] = useState(null);

  const filteredBusStops = useMemo(() => {
    if (!searchTerm) return [];
    
    return busStops
      .filter(stop => 
        stop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stop.id.toString().includes(searchTerm)
      )
      .slice(0, 5);
  }, [busStops, searchTerm]);

  const handleSelectBusStop = (stop) => {
    setSelectedBusStop(stop);
    setSearchTerm(stop.name);
    setIsDropdownOpen(false);
    onSelectBusStop(stop.id);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
          placeholder="Search Bus Stops"
          className="w-full p-2 sm:p-3 pl-8 sm:pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
        />
        <Search 
          className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-white" 
          size={16} 
        />
      </div>

      {isDropdownOpen && filteredBusStops.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
      )}

      {isDropdownOpen && filteredBusStops.length === 0 && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-center text-gray-400 text-sm">
          No bus stops found
        </div>
      )}
    </div>
  );
};

export default BusStopAutocomplete;