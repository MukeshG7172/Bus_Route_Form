'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'

export default function ViewResponses() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 6;

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch('/api/students');
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                const data = await response.json();
                setStudents(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching students:', error);
                setError('Failed to load students');
                setIsLoading(false);
            }
        }

        fetchStudents();
    }, []);

    const handleExport = async () => {
        try {
            const response = await fetch('/api/export');
            if (!response.ok) {
                throw new Error('Export failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export students');
        }
    };

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(students.length / studentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <p className="text-[#00f5d0] text-2xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <p className="text-red-500 text-2xl">{error}</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            
            <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <Image
                        src="/logo2.png"
                        alt="Left Logo"
                        width={100}
                        height={40}
                        className="object-contain"
                    />
                    <p className='text-white text-3xl sm:text-4xl md:text-6xl font-hacked text-center'>
                        Hackerz <span className='text-[#00f5d0]'>Forms</span>
                    </p>
                    <Image
                        src="/logo1.png"
                        alt="Right Logo"
                        width={100}
                        height={40}
                        className="object-contain"
                    />
                </div>
            </div>
    
            
            <div className="relative w-full h-36 sm:h-48 md:h-64">
                <Image
                    src="/logo1.png"
                    alt="Students Banner"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
                        Student <span className='text-[#00f5d0]'>List</span>
                    </h1>
                </div>
            </div>
    
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
                    
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <p className="text-[#00f5d0] text-xl sm:text-2xl text-center w-full sm:w-auto">
                            Responses
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full sm:w-auto p-3 bg-[#00f5d0] text-black rounded-lg font-bold hover:bg-[#00c2a8] transition-colors"
                        >
                            Export to Excel
                        </button>
                    </div>
    
                    {students.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No students found</p>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-700/50 hidden md:table">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Phone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Year</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Bus Stop</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {currentStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-purple-500/5 transition-colors"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{student.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{student.phone}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{student.year}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{student.busStop.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
    
                            <div className="md:hidden">
                                {currentStudents.map((student) => (
                                    <div 
                                        key={student.id} 
                                        className="bg-gray-800/50 m-4 p-4 rounded-lg shadow-md"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <span className="text-purple-300 font-semibold">Name:</span>
                                            <span className="text-gray-300">{student.name}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-purple-300 font-semibold">Phone:</span>
                                            <span className="text-gray-300">{student.phone}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-purple-300 font-semibold">Year:</span>
                                            <span className="text-gray-300">{student.year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-purple-300 font-semibold">Bus Stop:</span>
                                            <span className="text-gray-300">{student.busStop.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
    
                            <div className="flex justify-center items-center space-x-2 py-4 bg-gray-900/20">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`
                                            w-10 h-10 rounded-full 
                                            ${currentPage === index + 1 
                                                ? 'bg-[#00f5d0] text-black' 
                                                : 'bg-gray-700 text-white hover:bg-gray-600'}
                                        `}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}