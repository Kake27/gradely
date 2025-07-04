import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/ContextProvider";
import { useContext, useEffect, useState } from "react";
import { BookOpen, ClipboardList, LogOut, CheckCircle, Users, Calendar } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function TADashboard() {
    const {user, loading, logout} = useContext(UserContext)
    const navigate = useNavigate();
    const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));

    const [courses, setCourses] = useState([])
    const [activeTab, setActiveTab] = useState('courses');

    const [assignments, setAssignments] = useState([])


    useEffect(() => {
        if(loading) return;
        const fetchCourses = async() => {
             try {
                const res = await axios.get(`http://localhost:5000/ta/getCourses/${user.id}`)

                setCourses(res.data.courses)
                const courses = res.data.courses

                const allAssignments = courses.flatMap(course => course.assignments || []);
                setAssignments(allAssignments)

            }
            catch(err) {
                console.log("Error loading courses: ", err);
            }
        }

        if(user) fetchCourses()
    }, [user.id])

    const checkedSolutions = [
        { 
        id: '1', 
        studentName: 'Alice Johnson', 
        assignment: 'Binary Trees Implementation', 
        course: 'Data Structures', 
        grade: 'A-', 
        checkedDate: '2024-03-20', 
        feedback: 'Good implementation, minor optimization needed' 
        },
        { 
        id: '2', 
        studentName: 'Bob Smith', 
        assignment: 'Sorting Algorithms', 
        course: 'Algorithms', 
        grade: 'B+', 
        checkedDate: '2024-03-22', 
        feedback: 'Correct logic, could improve time complexity' 
        },
        { 
        id: '3', 
        studentName: 'Carol Davis', 
        assignment: 'SQL Queries', 
        course: 'Database Systems', 
        grade: 'A', 
        checkedDate: '2024-03-23', 
        feedback: 'Excellent work, all queries optimized' 
        },
        { 
        id: '4', 
        studentName: 'David Wilson', 
        assignment: 'Binary Trees Implementation', 
        course: 'Data Structures', 
        grade: 'B', 
        checkedDate: '2024-03-21', 
        feedback: 'Good understanding, some edge cases missed' 
        },
    ];

    const handleLogout = async () => {
        navigate('/login');
        toast.success("Logged out succesfully")
        await delay(1000)
        
        logout()
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                    <p className="text-gray-600">Computer Science Department</p>
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
                    <button
                    onClick={() => setActiveTab('solutions')}
                    className={`${
                        activeTab === 'solutions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                    <CheckCircle className="h-5 w-5" />
                    Checked Solutions
                    </button>
                </nav>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                    <div key={course._id}
                    onClick={() => navigate(`/ta/courses/${course._id}`)}
                     className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{course.name}</h3>
                        <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-5 w-5" />
                            <span>{course.students.length} Student(s)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen className="h-5 w-5" />
                            <span>Faculty: {course.faculty.name}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}

                {activeTab === 'assignments' && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
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
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(assignment.submissions.length / assignment.course.students.length) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                                {Math.round((assignment.submissions.length / assignment.course.students.length) * 100)}%
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

                {activeTab === 'solutions' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Checked Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feedback
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {checkedSolutions.map((solution) => (
                        <tr key={solution.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {solution.studentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {solution.assignment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {solution.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(solution.grade)}`}>
                                {solution.grade}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(solution.checkedDate).toLocaleDateString()}
                            </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {solution.feedback}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </main>
        </div>
    )
}