import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, LogOut, Calendar, ClipboardList, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export default function StudentDashboard() {
    const {user, logout, loading} = useContext(UserContext);

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('courses');

    const [courses, setCourses] = useState([])

    const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));
    

    useEffect(() => {
        const fetchCourses = async() => {
            try {
                const res = await axios.get(`http://localhost:5000/student/getCourses/${user.id}`)
                setCourses(res.data.courses)

            }
            catch(err) {
                console.log("Error loading courses: ", err);
            }
        }

        fetchCourses()
    }, [user.id])

    const assignments = [
        { 
        id: '1', 
        name: 'Binary Trees Implementation', 
        course: 'Data Structures', 
        dueDate: '2024-03-25', 
        description: 'Implement binary search tree with insert, delete, and search operations',
        maxPoints: 100,
        status: 'pending'
        },
        { 
        id: '2', 
        name: 'Sorting Algorithms Analysis', 
        course: 'Algorithms', 
        dueDate: '2024-03-28', 
        description: 'Compare time complexity of different sorting algorithms',
        maxPoints: 80,
        status: 'pending'
        },
        { 
        id: '3', 
        name: 'SQL Query Optimization', 
        course: 'Database Systems', 
        dueDate: '2024-03-20', 
        description: 'Optimize given SQL queries for better performance',
        maxPoints: 90,
        status: 'overdue'
        },
        { 
        id: '4', 
        name: 'Project Proposal', 
        course: 'Software Engineering', 
        dueDate: '2024-04-05', 
        description: 'Submit detailed project proposal with timeline',
        maxPoints: 50,
        status: 'submitted'
        },
    ];

    const submissions = [
        { 
        id: '1', 
        assignmentName: 'Linked List Implementation', 
        course: 'Data Structures', 
        submittedDate: '2024-03-15', 
        status: 'checked',
        grade: 'A-',
        maxPoints: 100,
        feedback: 'Excellent implementation! Minor optimization suggestions in comments.',
        fileName: 'linked_list.cpp'
        },
        { 
        id: '2', 
        assignmentName: 'Graph Traversal', 
        course: 'Algorithms', 
        submittedDate: '2024-03-18', 
        status: 'checked',
        grade: 'B+',
        maxPoints: 85,
        feedback: 'Good understanding of BFS and DFS. Edge case handling could be improved.',
        fileName: 'graph_traversal.py'
        },
        { 
        id: '3', 
        assignmentName: 'Database Design', 
        course: 'Database Systems', 
        submittedDate: '2024-03-22', 
        status: 'unchecked',
        maxPoints: 75,
        fileName: 'database_design.sql'
        },
        { 
        id: '4', 
        assignmentName: 'Project Proposal', 
        course: 'Software Engineering', 
        submittedDate: '2024-03-24', 
        status: 'unchecked',
        maxPoints: 50,
        fileName: 'project_proposal.pdf'
        },
    ];

    const handleLogout = async () => {
        navigate("/login")
        toast.success("Logged out successfully")
        await delay(1000);
        logout()
    };

    const getStatusIcon = (status) => {
        switch (status) {
        case 'pending':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        case 'submitted':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'overdue':
            return <AlertCircle className="h-5 w-5 text-red-500" />;
        default:
            return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
        case 'pending':
            return 'text-yellow-600 bg-yellow-100';
        case 'submitted':
            return 'text-green-600 bg-green-100';
        case 'overdue':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
        }
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
        {/* Header */}
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, Student</h1>
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
                Enrolled Courses
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
                Pending Assignments
                </button>
                <button
                onClick={() => setActiveTab('submissions')}
                className={`${
                    activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                <Upload className="h-5 w-5" />
                My Submissions
                </button>
            </nav>
            </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{course.name}</h3>
                    <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-5 w-5" />
                        <span><b>Instructor: </b>{course.faculty.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="h-5 w-5" />
                        <span><b>{course.assignments.length}</b> Assignments</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span>{course.schedule}</span>
                    </div> */}
                    </div>
                </div>
                ))}
            </div>
            )}

            {activeTab === 'assignments' && (
            <div className="space-y-4">
                {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.name}</h3>
                        {getStatusIcon(assignment.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        </div>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.course}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span>Max Points: {assignment.maxPoints}</span>
                        </div>
                    </div>
                    {assignment.status === 'pending' && (
                        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Submit
                        </button>
                    )}
                    </div>
                    {isOverdue(assignment.dueDate) && assignment.status === 'pending' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">This assignment is overdue!</p>
                    </div>
                    )}
                </div>
                ))}
            </div>
            )}

            {activeTab === 'submissions' && (
            <div className="space-y-6">
                {/* Checked Submissions */}
                <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Graded Submissions
                </h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feedback
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.filter(s => s.status === 'checked').map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div className="text-sm font-medium text-gray-900">{submission.assignmentName}</div>
                                <div className="text-sm text-gray-500">{submission.fileName}</div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(submission.submittedDate).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(submission.grade)}`}>
                                    {submission.grade}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                    / {submission.maxPoints} pts
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                <div className="truncate" title={submission.feedback}>
                                    {submission.feedback}
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

                {/* Unchecked Submissions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-yellow-500" />
                        Pending Review
                    </h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-yellow-50">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assignment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Max Points
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.filter(s => s.status === 'unchecked').map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div className="text-sm font-medium text-gray-900">{submission.assignmentName}</div>
                                <div className="text-sm text-gray-500">{submission.fileName}</div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(submission.submittedDate).toLocaleDateString()}
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.maxPoints} pts
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">
                                Under Review
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            )}
        </main>
    </div>
    )
}