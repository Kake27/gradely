import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/ContextProvider";
import { ArrowLeft, Users, BookOpen, ClipboardList, Upload, CheckCircle, Clock, AlertCircle,Menu,X,Calendar,User,
         GraduationCap,FileText,RefreshCw} from 'lucide-react';
import axios from "axios";


export default function StudentCourse() {
    const {user, logout, loading} = useContext(UserContext)
    const navigate = useNavigate()
    const {courseId} = useParams()

    const [activeTab, setActiveTab] = useState('assignments');
    const [showSidebar, setShowSidebar] = useState(false);
    const [showReEvalModal, setShowReEvalModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reEvalReason, setReEvalReason] = useState('');

    const [courseData, setCourseData] = useState([])
    const [faculty, setFaculty] = useState(null)
    const [tas, setTas] = useState([])
    const [students, setStudents] = useState([])

    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        if(loading) return;
        const fetchCourses = async() => {
             try {
              const res = await axios.get(`http://localhost:5000/course/getStudent/${courseId}`)
              const resStudents = res.data.students
              
              if(!(resStudents.some(student=>student._id.toString() === user.id.toString()))) {
                  navigate('/unauthorized')
                  return
              }

              setCourseData(res.data)
              setFaculty(res.data.faculty)
              setTas(res.data.tas)
              setStudents(res.data.students)

              const assignmentRes = await axios.get(`http://localhost:5000/course/getAssignments/${courseId}`)
              setAssignments(assignmentRes.data.assignments)

              console.log(assignmentRes.data.assignments)

          }
          catch(err) {
              console.log("Error fetching course: ", err);
              navigate('/unauthorized')
              return;
          }
        }

        if(user) fetchCourses()

    }, [loading, user, courseId])
    
    // const assignments = [
    //     {
    //     id: '1',
    //     name: 'Binary Trees Implementation',
    //     description: 'Implement binary search tree with insert, delete, and search operations',
    //     dueDate: '2024-03-25',
    //     maxPoints: 100,
    //     uploadedDate: '2024-03-10',
    //     uploadedBy: 'Prof. Smith',
    //     status: 'submitted'
    //     },
    //     {
    //     id: '2',
    //     name: 'Linked List Operations',
    //     description: 'Create a doubly linked list with various operations',
    //     dueDate: '2024-04-05',
    //     maxPoints: 80,
    //     uploadedDate: '2024-03-15',
    //     uploadedBy: 'Prof. Smith',
    //     status: 'pending'
    //     },
    //     {
    //     id: '3',
    //     name: 'Graph Algorithms',
    //     description: 'Implement BFS and DFS traversal algorithms',
    //     dueDate: '2024-04-15',
    //     maxPoints: 120,
    //     uploadedDate: '2024-03-20',
    //     uploadedBy: 'Prof. Smith',
    //     status: 'pending'
    //     },
    //     {
    //     id: '4',
    //     name: 'Hash Tables',
    //     description: 'Implement hash table with collision resolution',
    //     dueDate: '2024-03-20',
    //     maxPoints: 90,
    //     uploadedDate: '2024-03-05',
    //     uploadedBy: 'Prof. Smith',
    //     status: 'overdue'
    //     }
    // ];

    const submissions = [
        {
        id: '1',
        assignmentName: 'Binary Trees Implementation',
        submittedDate: '2024-03-24',
        fileName: 'binary_tree.cpp',
        status: 'graded',
        grade: 'A-',
        maxPoints: 100,
        feedback: 'Excellent implementation with good optimization. Minor improvements in edge case handling.',
        gradedBy: 'TA Sarah Wilson',
        gradedDate: '2024-03-26',
        canRequestReEvaluation: true
        },
        {
        id: '2',
        assignmentName: 'Sorting Algorithms',
        submittedDate: '2024-03-18',
        fileName: 'sorting.py',
        status: 'graded',
        grade: 'B+',
        maxPoints: 85,
        feedback: 'Good understanding of algorithms. Time complexity analysis could be more detailed.',
        gradedBy: 'TA Mike Chen',
        gradedDate: '2024-03-20',
        canRequestReEvaluation: true
        },
        {
        id: '3',
        assignmentName: 'Hash Tables',
        submittedDate: '2024-03-19',
        fileName: 'hashtable.java',
        status: 'graded',
        grade: 'C+',
        maxPoints: 90,
        feedback: 'Basic implementation works but collision handling needs improvement.',
        gradedBy: 'TA Emily Rodriguez',
        gradedDate: '2024-03-22',
        canRequestReEvaluation: true
        },
        {
        id: '4',
        assignmentName: 'Dynamic Programming',
        submittedDate: '2024-03-25',
        fileName: 'dp_solutions.cpp',
        status: 'pending',
        maxPoints: 95,
        canRequestReEvaluation: false
        }
    ];

    // const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue');

    const handleBack = () => {
        navigate('/student');
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

    const handleRequestReEvaluation = (submission) => {
        setSelectedSubmission(submission);
        setShowReEvalModal(true);
    };

    const handleSubmitReEvaluation = () => {
        if (reEvalReason.trim() && selectedSubmission) {
        // Here you would typically send the re-evaluation request to your backend
        console.log('Re-evaluation request submitted:', {
            submissionId: selectedSubmission.id,
            reason: reEvalReason
        });
        
        // Reset form and close modal
        setReEvalReason('');
        setSelectedSubmission(null);
        setShowReEvalModal(false);
        
        // You might want to show a success message here
        alert('Re-evaluation request submitted successfully!');
        }
    };

    const handleCancelReEvaluation = () => {
        setReEvalReason('');
        setSelectedSubmission(null);
        setShowReEvalModal(false);
    };

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{courseData.name}</h1>
                <p className="text-gray-600">Student View</p>
              </div>
            </div>
            
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Menu className="h-5 w-5" />
              Participants
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`${
                    activeTab === 'assignments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <ClipboardList className="h-5 w-5" />
                  All Assignments ({assignments.length})
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
                  My Submissions ({submissions.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <Clock className="h-5 w-5" />
                  Pending 10
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Course Assignments</h2>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            {/* {getStatusIcon(assignment.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span> */}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Uploaded by: Prof. {faculty ? faculty.name : 'N/A'}
                            </span>
                            <span>Max Points: {assignment.marks}</span>
                          </div>
                        </div>
                        {assignment.status === 'pending' && (
                          <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Submit
                          </button>
                        )}
                        {assignment.status === 'overdue' && (
                          <button className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Submit Late
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
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Submissions</h2>
                
                {/* Graded Submissions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Graded Submissions
                  </h3>
                  <div className="space-y-4">
                    {submissions.filter(s => s.status === 'graded').map((submission) => (
                      <div key={submission.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{submission.assignmentName}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(submission.grade)}`}>
                                {submission.grade}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {submission.fileName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Graded by: {submission.gradedBy}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                              <p className="text-sm text-gray-700 font-medium mb-1">Feedback:</p>
                              <p className="text-sm text-gray-600">{submission.feedback}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Points: {submission.grade} / {submission.maxPoints} pts
                            </div>
                          </div>
                          {submission.canRequestReEvaluation && (
                            <button
                              onClick={() => handleRequestReEvaluation(submission)}
                              className="ml-4 flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Request Re-evaluation
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Submissions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Pending Review
                  </h3>
                  <div className="space-y-4">
                    {submissions.filter(s => s.status === 'pending').map((submission) => (
                      <div key={submission.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{submission.assignmentName}</h4>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">
                                Under Review
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {submission.fileName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                              </span>
                              <span>Max Points: {submission.maxPoints}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Assignments</h2>
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
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
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span>Max Points: {assignment.maxPoints}</span>
                          </div>
                        </div>
                        <button 
                          className={`ml-4 px-4 py-2 text-white rounded-lg transition-colors ${
                            assignment.status === 'overdue' 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {assignment.status === 'overdue' ? 'Submit Late' : 'Submit'}
                        </button>
                      </div>
                      {assignment.status === 'overdue' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm font-medium">This assignment is overdue!</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 bg-white rounded-lg shadow p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Participants</h3>
            
            {/* Faculty Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">Faculty</h4>
              </div>
              {faculty && (
                <div className="space-y-2">
                    <div key={faculty._id} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {faculty.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{faculty.name}</p>
                            <p className="text-xs text-gray-500 truncate">{faculty.email}</p>
                        </div>
                    </div>
              </div>)}
            </div>

            {/* TAs Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Teaching Assistants ({tas.length})</h4>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tas.map((ta) => (
                  <div key={ta._id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {ta.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ta.name}</p>
                      <p className="text-xs text-gray-500 truncate">{ta.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Students ({students.length})</h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Course Participants</h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Faculty Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Faculty ({faculty.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {faculty.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TAs Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Teaching Assistants ({tas.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {tas.map((ta) => (
                      <div key={ta.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {ta.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ta.name}</p>
                          <p className="text-xs text-gray-500 truncate">{ta.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Students Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Students ({students.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                          <p className="text-xs text-gray-500 truncate">{student.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Re-evaluation Request Modal */}
      {showReEvalModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Request Re-evaluation</h3>
              <button
                onClick={handleCancelReEvaluation}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedSubmission.assignmentName}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Current Grade: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(selectedSubmission.grade)}`}>
                    {selectedSubmission.grade}
                  </span></span>
                  <span>Max Points: {selectedSubmission.maxPoints}</span>
                </div>
              </div>

              <div>
                <label htmlFor="reEvalReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Re-evaluation Request *
                </label>
                <textarea
                  id="reEvalReason"
                  value={reEvalReason}
                  onChange={(e) => setReEvalReason(e.target.value)}
                  placeholder="Please explain why you believe your submission deserves re-evaluation..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  Your request will be reviewed by the teaching assistant who graded your submission. 
                  Please provide specific reasons for your request.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelReEvaluation}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReEvaluation}
                disabled={!reEvalReason.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}