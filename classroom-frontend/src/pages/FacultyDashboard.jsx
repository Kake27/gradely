import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/ContextProvider";
import { useContext, useState, useEffect } from "react";
import { BookOpen, Users, LogOut, Calendar, ClipboardList, Plus, X } from 'lucide-react';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export default function FacultyDashboard() {
    const navigate = useNavigate()
    const {user, loading, logout} = useContext(UserContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [createCourseLoading, setCreateCourseLoading] = useState(false);

    const [courses, setCourses] = useState([])
    const [assignments, setAssignments] = useState([]);

    const [activeTab, setActiveTab] = useState('courses');

    const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));

    useEffect(() => {
        if(loading) return;
        const fetchCourses = async () => {
            try {
                const courseRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/getCourses/${user.id}`)
                setCourses(courseRes.data.courses)

                const assignmentRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/getAssignments/${user.id}`)
                setAssignments(assignmentRes.data.assignments)
            }
            catch(err) {
                toast.error("Error loading courses: ", err);
            }
        };

        if(user) fetchCourses()
    }, [user.id])


    const handleLogout = async () => {
        navigate("/login")

        await delay(1000);
        logout()
    }

    const handleCreateCourse = async () => {
        try {
            const courseRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/course/createCourse`, {
                name: courseName,
                faculty: user.id
            })

            if(courseRes.data.error) {
                console.error("Error creating course in backend:", courseRes.data.error);
                return ;
            }
            // console.log("Course created in backend:", courseRes.data);

            const facultyRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/addCourse`, {
                facultyId: user.id,
                courseId: courseRes.data._id
            })

            if(facultyRes.data.error) {
                toast.error("Error adding course to the faculty: ", facultyRes.data.error)
                return;
            }

            // console.log("Course added to faculty: ", facultyRes.data)
            toast.success("Course created succesfully!")

            navigate(`/faculty/courses/${courseRes.data._id}`)
        }
        catch(err) {
            toast.error("Error creating course:", err);
        }
    }

    const handleCancelCreate = () => {
        setCourseName('');
        setShowCreateModal(false);
    };

    return (
         <div className="min-h-screen bg-gray-50">
            <Toaster />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                    onClick={() => setActiveTab('courses')}
                    className={`${
                        activeTab === 'courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                    <BookOpen className="h-5 w-5" />
                    My Courses
                    </button>
                    <button
                    onClick={() => setActiveTab('assignments')}
                    className={`${
                        activeTab === 'assignments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                    <ClipboardList className="h-5 w-5" />
                    Assignments
                    </button>
                </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'courses' ? (
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
                            <button onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus className="h-5 w-5" />
                                Create Course
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                            <div key={course._id} 
                                onClick={() => navigate(`/faculty/courses/${course._id}`)}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition-shadow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{course.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="h-5 w-5" />
                                        <span>{course.students.length} Students</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BookOpen className="h-5 w-5" />
                                        <span>{course.tas.length} Teaching Assistants</span>
                                    </div>
                                </div>
                            </div>
    
                            ))}
                        </div>
                    </div>
                
                ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submissions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map((assignment) => (
                        <tr key={assignment._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assignment.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.course.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.submissions.length} / {assignment.course.students.length}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </main>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
                            <button
                                onClick={handleCancelCreate}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <div className="mb-4">
                            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                            Course Name
                            </label>
                            <input
                            type="text"
                            id="courseName"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Enter course name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            autoFocus
                            required
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            onClick={handleCancelCreate}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateCourse}
                            disabled={!courseName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Create Course
                        </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}   