import React, { useState, useEffect } from "react";
import { db } from "../../config/config"; 
import { collection, getDocs } from "firebase/firestore";

interface Student {
  id: string;
  name: string;
  email: string;
  attendance: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const studentsCollectionRef = collection(db, "students"); // Adjust your collection name here

  // Fetch students from the database (e.g., Firebase Firestore)
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(studentsCollectionRef);
      const studentsData: Student[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (err) {
      setError("Failed to fetch students data.");
    } finally {
      setLoading(false);
    }
  };

  // Search filter functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array to fetch data only once when component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search students..."
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-2 w-full rounded-lg border border-gray-300"
      />

      {/* Student Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Attendance</th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="py-2 px-4 text-sm">{student.name}</td>
                  <td className="py-2 px-4 text-sm">{student.email}</td>
                  <td className="py-2 px-4 text-sm">{student.attendance}</td>
                  <td className="py-2 px-4 text-sm">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">
                      View
                    </button>
                    <button className="ml-2 bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="ml-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
