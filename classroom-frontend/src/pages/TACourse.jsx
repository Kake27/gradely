import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/ContextProvider";
import { ArrowLeft, Users, BookOpen, ClipboardList, CheckCircle, Clock,AlertTriangle,Menu,X,Calendar,User,
        GraduationCap,Eye,Star} from 'lucide-react';
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";


export default function TACourse() {
    const navigate = useNavigate()
    const {user, loading} = useContext(UserContext)
    const { courseId } = useParams();
    const [activeTab, setActiveTab] = useState('assignments');
    const [showSidebar, setShowSidebar] = useState(false);

    // Page Data
    const [courseData, setCourseData] = useState([])
    const [faculty, setFaculty] = useState(null)
    const [students, setStudents] = useState([])
    const [tas, setTas] = useState([])
    const [assignments, setAssignments] = useState([])

    const [toGradeSolutions, setToGradeSolutions] = useState([])
    const [gradedSolutions, setGradedSolutions] = useState([])


    // PDF View State
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

    useEffect(() => {
        if(loading) return;
        const fetchCourses = async() => {
             try {
              const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/getTA/${courseId}`)
              const resTAs = res.data.tas
              
              if(!(resTAs.some(ta=>ta._id.toString() === user.id.toString()))) {
                  navigate('/unauthorized')
                  return
              }
              setCourseData(res.data)

              setFaculty(res.data.faculty)
              setTas(res.data.tas)
              setStudents(res.data.students)

              const assignmentRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/getAssignments/${courseId}`)
              setAssignments(assignmentRes.data.assignments)

              // console.log(assignmentRes.data.assignments)

              const gradedSubmissions = assignmentRes.data.assignments.flatMap(assignment =>
                assignment.gradedSubmissions.map(sub => ({
                  ...sub,
                  assignmentName: assignment.title,
                  assignmentDueDate: assignment.dueDate,
                  maxMarks: assignment.marks
                }))
              );

              const ungradedSubmissions = assignmentRes.data.assignments.flatMap(assignment =>
                assignment.ungradedSubmissions.map(sub => ({
                  ...sub,
                  assignmentName: assignment.title,
                  assignmentDueDate: assignment.dueDate,
                  maxMarks: assignment.marks
                }))
              );

              setToGradeSolutions(ungradedSubmissions)
              setGradedSolutions(gradedSubmissions)

          }
          catch(err) {
              toast.error("Error fetching course: ", err);
              navigate('/unauthorized')
              return;
          }
        }

        if(user) fetchCourses()

    }, [loading, user, courseId])

  const reEvaluationRequests = [
    {
      id: '1',
      assignmentName: 'Hash Tables',
      studentName: 'Frank Miller',
      studentId: 'CS006',
      originalGrade: 'B+',
      requestDate: '2024-03-22',
      reason: 'I believe my implementation handles edge cases better than reflected in the grade. Could you please review the collision resolution method I used?',
      status: 'pending',
      maxPoints: 90
    },
    {
      id: '2',
      assignmentName: 'Sorting Algorithms',
      studentName: 'Henry Taylor',
      studentId: 'CS008',
      originalGrade: 'C+',
      requestDate: '2024-03-20',
      reason: 'The time complexity analysis section was marked incorrect, but I believe my calculations are accurate for the merge sort implementation.',
      status: 'pending',
      maxPoints: 85
    }
  ];

  const handleBack = () => {
    navigate('/ta');
  };


  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleGradeSubmission = (submissionId, assignmentId) => {
    navigate(`/checkSubmission/${assignmentId}/${submissionId}` , {
      state: {
        returnPath: window.location.pathname,
        role: 'ta'
      }
    })
  }

      //PDF Viewing Functionality
    const handleViewPdf = (pdfUrl) => {
      setSelectedPdfUrl(pdfUrl);
      setShowPdfViewer(true);
    };

    const handleClosePdfViewer = () => {
      setShowPdfViewer(false);
      setSelectedPdfUrl('');
    };

    function PdfViewer({ pdfUrl }) {
      return (
        <iframe
          src={pdfUrl}
          title="Assignment PDF"
          width="100%"
          height="600px"
          style={{ border: "none", borderRadius: "8px" }}
        ></iframe>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster />
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
                <p className="text-gray-600">Teaching Assistant View</p>
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
                  Course Assignments ({assignments.length})
                </button>
                <button
                  onClick={() => setActiveTab('toGrade')}
                  className={`${
                    activeTab === 'toGrade'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <Clock className="h-5 w-5" />
                  To Grade ({toGradeSolutions.length})
                </button>
                <button
                  onClick={() => setActiveTab('graded')}
                  className={`${
                    activeTab === 'graded'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <CheckCircle className="h-5 w-5" />
                  Graded ({gradedSolutions.length})
                </button>
                <button
                  onClick={() => setActiveTab('reEvaluation')}
                  className={`${
                    activeTab === 'reEvaluation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  Re-evaluation ({reEvaluationRequests.length})
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Assignments</h2>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between ">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Uploaded by: {faculty.name}
                            </span>
                            <span>Max Points: {assignment.marks}</span>
                          </div>
                           <div className="flex items-center gap-4 mt-4">
                            {assignment.url && (
                              <button
                                onClick={() => handleViewPdf(assignment.url)}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                              >
                                <Eye className="h-4 w-4" />
                                View PDF
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'toGrade' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assignments to Grade</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
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
                            Submitted
                          </th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th> */}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max Points
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {toGradeSolutions.map((solution) => (
                          <tr key={solution._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{solution.student.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{solution.assignmentName}</div>
                                <div className="text-sm text-gray-500">{solution.filename}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(solution.submittedDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {solution.maxMarks} pts
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                      onClick={() => handleGradeSubmission(solution._id, solution.assignment)}>
                                Grade
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'graded' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Graded Assignments</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
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
                            Grade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Graded Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Graded By
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Feedback
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {gradedSolutions.map((solution) => (
                          <tr key={solution._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{solution.student.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{solution.assignmentName}</div>
                                <div className="text-sm text-gray-500">{solution.filename}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(solution.grade)}`}>
                                {solution.grade}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {solution.marks} / {solution.maxMarks} pts
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(solution.checkedDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              {solution.gradedBy.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              <div className="truncate" title={solution.feedback}>
                                {solution.feedback}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reEvaluation' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Re-evaluation Requests</h2>
                <div className="space-y-4">
                  {reEvaluationRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.assignmentName}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {request.studentName} ({request.studentId})
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Requested: {new Date(request.requestDate).toLocaleDateString()}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(request.originalGrade)}`}>
                              Original: {request.originalGrade}
                            </span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-700 font-medium mb-1">Student's Reason:</p>
                            <p className="text-sm text-gray-600">{request.reason}</p>
                          </div>
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Reject
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Review Submission
                          </button>
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
                <h4 className="font-medium text-gray-900">Faculty </h4>
              </div>
                {faculty && (<div className="space-y-2">
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
                    <h4 className="font-medium text-gray-900">Faculty (1)</h4>
                  </div>
                  <div className="space-y-2">
                    {faculty && (
                      <div key={faculty._id} className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {faculty.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{faculty.name}</p>
                          <p className="text-xs text-gray-500 truncate">{faculty.email}</p>
                        </div>
                      </div>
                    )}
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
                  <div className="space-y-2">
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
            </div>
          )}
        </div>
      </div>
       {showPdfViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assignment PDF</h3>
              <button
                onClick={handleClosePdfViewer}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <PdfViewer pdfUrl={selectedPdfUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
    )
}