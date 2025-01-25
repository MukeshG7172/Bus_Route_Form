'use client'
import { useState, useEffect } from 'react'
import BusStopAutocomplete from '@/components/BusStopAutocomplete'
import Image from 'next/image'

export default function StudentForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [year, setYear] = useState('')
  const [busStops, setBusStops] = useState([])
  const [selectedBusStop, setSelectedBusStop] = useState(null)

  useEffect(() => {
    async function fetchBusStops() {
      try {
        const response = await fetch('/api/bus-stops')
        const data = await response.json()
        setBusStops(data)
      } catch (error) {
        console.error('Failed to fetch bus stops', error)
      }
    }
    fetchBusStops()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedBusStop) {
      alert('Please select a bus stop')
      return
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          year,
          busStopId: selectedBusStop
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add student')
      }

      setName('')
      setPhone('')
      setYear('')
      setSelectedBusStop(null)
      alert('Student added successfully!')
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Failed to add student')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="relative w-full h-25 from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <Image
            src="/logo2.png"
            alt="Left Logo"
            width={120}
            height={40}
            className="object-contain mt-[-10px]"
          />
          <p className='text-white text-6xl font-hacked'>Hackerz <span className='text-[#00f5d0]'>Forms</span></p>
          <Image
            src="/logo1.png"
            alt="Right Logo"
            width={120}
            height={40}
            className="object-contain mt-[8px]"
          />
        </div>
      </div>

      <div className="relative w-full h-48 md:h-64">
        <Image
          src="/logo1.png"
          alt="Student Form Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
            Student <span className='text-[#00f5d0]'>Registration</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student Name"
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" className="bg-gray-800">Select Year</option>
              <option value="I" className="bg-gray-800">I</option>
              <option value="II" className="bg-gray-800">II</option>
              <option value="III" className="bg-gray-800">III</option>
              <option value="IV" className="bg-gray-800">IV</option>
            </select>
            <BusStopAutocomplete
              busStops={busStops}
              onSelectBusStop={(stopId) => setSelectedBusStop(stopId)}
            />
            <button
              type="submit"
              className="w-full p-3 bg-[#00f5d0] text-black rounded-lg font-bold hover:bg-[#00c2a8] transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}