'use client'
import { useState, useEffect } from 'react';


export default function ViewResponses() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Responses</h1>
      <button 
        onClick={handleExport} 
        className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Excel
      </button>
      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Bus Stop</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.phone}</td>
                <td className="border p-2">{student.busStop.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}