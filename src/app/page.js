'use client'
import { useState, useEffect } from 'react'
import BusStopAutocomplete from '@/components/BusStopAutocomplete'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function StudentForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [year, setYear] = useState('')
  const [busStops, setBusStops] = useState([])
  const [selectedBusStop, setSelectedBusStop] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    year: '',
    busStop: ''
  })

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

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      year: '',
      busStop: ''
    }

    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    
    const phoneRegex = /^\d{10}$/
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    
    if (!year) {
      newErrors.year = 'Please select a year'
    }

    
    if (!selectedBusStop) {
      newErrors.busStop = 'Please select a bus stop'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

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
      setErrors({
        name: '',
        phone: '',
        year: '',
        busStop: ''
      })
      alert('Student added successfully!')
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Failed to add student')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full py-4 sm:py-6 from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <Image
            src="/logo2.png"
            alt="Left Logo"
            width={120}
            height={40}
            className="object-contain mt-[-10px] w-16 sm:w-24 md:w-32"
          />
          <p className='text-white text-2xl sm:text-4xl md:text-6xl font-hacked text-center'>
            Hackerz <span className='text-[#00f5d0]'>Forms</span>
          </p>
          <Image
            src="/logo1.png"
            alt="Right Logo"
            width={120}
            height={40}
            className="object-contain mt-[8px] w-16 sm:w-24 md:w-32"
          />
        </div>
      </div>
      <div className="relative w-full h-26 md:h-38 lg:h-64">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
            Bus Route <span className='text-[#00f5d0]'>Details</span>
          </h1>
        </div>
      </div>

      
      <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
                className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" className="bg-gray-800">Select Year</option>
                <option value="I" className="bg-gray-800">I</option>
                <option value="II" className="bg-gray-800">II</option>
                <option value="III" className="bg-gray-800">III</option>
                <option value="IV" className="bg-gray-800">IV</option>
              </select>
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <BusStopAutocomplete
                busStops={busStops}
                onSelectBusStop={(stopId) => setSelectedBusStop(stopId)}
              />
              {errors.busStop && <p className="text-red-500 text-sm mt-1">{errors.busStop}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-2 sm:p-3 bg-[#00f5d0] text-black rounded-lg font-bold hover:bg-[#00c2a8] transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}