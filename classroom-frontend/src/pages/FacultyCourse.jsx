import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/ContextProvider";
import { ArrowLeft, Users, BookOpen, ClipboardList, Upload, Plus, X, Calendar, CheckCircle, Clock,Menu,UserPlus} from 'lucide-react';

import toast, {Toaster} from "react-hot-toast";

export default function FacultyCourse() {
    const navigate = useNavigate()
    const {user, logout, loading} = useContext(UserContext);
    
    const {courseId} = useParams()

    const [courseData, setCourseData] = useState([])

    const [activeTab, setActiveTab] = useState('assignments');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
    const [participantType, setParticipantType] = useState('student');
    const [showSidebar, setShowSidebar] = useState(false);

    const [students, setStudents] = useState([])
    const [tas, setTas] = useState([])

    const [assignmentForm, setAssignmentForm] = useState({
        name: '',
        description: '',
        dueDate: '',
        maxPoints: ''
    });
    const [participantForm, setParticipantForm] = useState({
        name: '',
        email: ''
    });

    const [assignments, setAssignments] = useState([
    {
      id: '1',
      name: 'Binary Trees Implementation',
      description: 'Implement binary search tree with insert, delete, and search operations',
      dueDate: '2024-03-25',
      maxPoints: 100,
      submissions: 98,
      totalStudents: 120
    },
    {
      id: '2',
      name: 'Linked List Operations',
      description: 'Create a doubly linked list with various operations',
      dueDate: '2024-04-05',
      maxPoints: 80,
      submissions: 45,
      totalStudents: 120
    }
  ]);

  const submissions = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentId: 'CS001',
      assignmentName: 'Binary Trees Implementation',
      submittedDate: '2024-03-20',
      fileName: 'binary_tree.cpp',
      status: 'graded',
      grade: 'A-',
      gradedBy: 'TA Sarah Wilson',
      gradedDate: '2024-03-22',
      feedback: 'Excellent implementation with good optimization'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentId: 'CS002',
      assignmentName: 'Binary Trees Implementation',
      submittedDate: '2024-03-21',
      fileName: 'btree_solution.py',
      status: 'graded',
      grade: 'B+',
      gradedBy: 'TA Mike Chen',
      gradedDate: '2024-03-23',
      feedback: 'Good logic, minor improvements needed'
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      studentId: 'CS003',
      assignmentName: 'Linked List Operations',
      submittedDate: '2024-03-24',
      fileName: 'linked_list.java',
      status: 'pending'
    },
    {
      id: '4',
      studentName: 'David Wilson',
      studentId: 'CS004',
      assignmentName: 'Binary Trees Implementation',
      submittedDate: '2024-03-19',
      fileName: 'tree_impl.cpp',
      status: 'graded',
      grade: 'A',
      gradedBy: 'TA Sarah Wilson',
      gradedDate: '2024-03-21',
      feedback: 'Perfect implementation with excellent documentation'
    }
  ];

  // const [participants, setParticipants] = useState([
  //   { id: '1', name: 'Sarah Wilson', email: 'sarah.wilson@university.edu', role: 'ta' },
  //   { id: '2', name: 'Mike Chen', email: 'mike.chen@university.edu', role: 'ta' },
  //   { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@university.edu', role: 'ta' },
  //   { id: '4', name: 'Alice Johnson', email: 'alice.johnson@student.edu', role: 'student' },
  //   { id: '5', name: 'Bob Smith', email: 'bob.smith@student.edu', role: 'student' },
  //   { id: '6', name: 'Carol Davis', email: 'carol.davis@student.edu', role: 'student' },
  //   { id: '7', name: 'David Wilson', email: 'david.wilson@student.edu', role: 'student' },
  //   { id: '8', name: 'Emma Brown', email: 'emma.brown@student.edu', role: 'student' },
  //   { id: '9', name: 'Frank Miller', email: 'frank.miller@student.edu', role: 'student' },
  //   { id: '10', name: 'Grace Lee', email: 'grace.lee@student.edu', role: 'student' },
  //   { id: '11', name: 'Henry Taylor', email: 'henry.taylor@student.edu', role: 'student' },
  //   { id: '12', name: 'Ivy Chen', email: 'ivy.chen@student.edu', role: 'student' }
  // ]);


    const handleBack = () => {
        navigate('/faculty');
    };

    const handleCreateAssignment = () => {
        if (assignmentForm.name.trim() && assignmentForm.dueDate && assignmentForm.maxPoints) {
        const newAssignment = {
            id: (assignments.length + 1).toString(),
            name: assignmentForm.name.trim(),
            description: assignmentForm.description.trim(),
            dueDate: assignmentForm.dueDate,
            maxPoints: parseInt(assignmentForm.maxPoints),
            submissions: 0,
            totalStudents: students.length
        };
        
        setAssignments([...assignments, newAssignment]);
        setAssignmentForm({ name: '', description: '', dueDate: '', maxPoints: '' });
        setShowCreateModal(false);
        }
    };

    const handleCancelCreate = () => {
        setAssignmentForm({ name: '', description: '', dueDate: '', maxPoints: '' });
        setShowCreateModal(false);
    };

    const handleAddParticipant = async () => {
        const email = participantForm.email.trim()
        if (email) {
          try {
            let res;
            if(participantType==='ta') {
                res = await axios.get("http://localhost:5000/ta/getTAID", {
                params: {email: email}
              })

              if(!res.data) {
                toast.error("This user hasn't registered yet!")
                return
              }

              const taId = res.data
              const courseRes = await axios.post("http://localhost:5000/course/addTA", {
                courseId: courseId,
                taId: taId
              })

              if(courseRes.data.error) {
                toast('This TA has already been added!', {
                  icon:'⚠️'
                })
                return;
              }

              const taRes = await axios.post("http://localhost:5000/ta/addCourse", {
                courseId: courseId,
                taId: taId
              })

              toast.success("Added TA successfully to the course!")
            }

            else {
              res = await axios.get("http://localhost:5000/student/getStudentID",{ 
                params: {email: email}
              })
              if(!res.data) {
                toast.error("This user hasn't registered yet!")
                return
              }

              const studentId = res.data
              const courseRes = await axios.post("http://localhost:5000/course/addStudent", {
                courseId: courseId,
                studentId: studentId
              })

              if(courseRes.data.error) {
                toast('This student has already been added!', {
                  icon:'⚠️'
                })
                return;
              }

              const studentRes = await axios.post("http://localhost:5000/student/addCourse", {
                courseId: courseId,
                studentId: studentId
              })

              toast.success("Added student successfully to the course!")
            }
          }
          catch(err) {
            console.log("Error accessing db", err);
            return;
          }

        // setParticipants([...participants, newParticipant]);
        setParticipantForm({ name: '', email: '' });
        setShowAddParticipantModal(false);
        }
    };

    const handleCancelAddParticipant = () => {
        setParticipantForm({ name: '', email: '' });
        setShowAddParticipantModal(false);
    };

    const openAddParticipantModal = (type) => {
        setParticipantType(type);
        setShowAddParticipantModal(true);
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
        if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };


    useEffect(() => {
      if(loading) return;
      const fetchCourse = async () => {
          try {
              const res = await axios.get(`http://localhost:5000/course/getFaculty/${courseId}`)
              
              if(res.data.faculty._id != user.id) {
                  navigate('/unauthorized')
                  return
              }
              setCourseData(res.data)
              setTas(res.data.tas)
              setStudents(res.data.students)

          }
          catch(err) {
              console.log("Error fetching course: ", err);
              navigate('/unauthorized')
              return;
          }
        }

        if(user) fetchCourse()

    }, [loading, user, courseId])

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
                <p className="text-gray-600">Course Management</p>
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
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`${
                    activeTab === 'assignments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <ClipboardList className="h-5 w-5" />
                  Assignments ({assignments.length})
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
                  Submissions ({submissions.length})
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'assignments' ? (
              <div>
                {/* Create Assignment Button */}
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Course Assignments</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus className="h-5 w-5" />
                    Upload Assignment
                  </button>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.name}</h3>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                            <span>Max Points: {assignment.maxPoints}</span>
                            <span>Submissions: {assignment.submissions}/{assignment.totalStudents}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((assignment.submissions / assignment.totalStudents) * 100)}% submitted
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Student Submissions</h2>
                
                {/* Submissions Table */}
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Graded By
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                                <div className="text-sm text-gray-500">{submission.studentId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{submission.assignmentName}</div>
                                <div className="text-sm text-gray-500">{submission.fileName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(submission.submittedDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {submission.status === 'graded' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                                  <CheckCircle className="h-3 w-3" />
                                  Graded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {submission.grade ? (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(submission.grade)}`}>
                                  {submission.grade}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {submission.gradedBy || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 bg-white rounded-lg shadow p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Participants</h3>
            
            {/* TAs Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Teaching Assistants ({tas.length})</h4>
                </div>
                <button
                  onClick={() => openAddParticipantModal('ta')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <UserPlus className="h-3 w-3" />
                  Add TA
                </button>
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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-gray-900">Students ({students.length})</h4>
                </div>
                <button
                  onClick={() => openAddParticipantModal('student')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  <UserPlus className="h-3 w-3" />
                  Add Student
                </button>
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
                
                {/* TAs Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Teaching Assistants ({tas.length})</h4>
                    </div>
                    <button
                      onClick={() => openAddParticipantModal('ta')}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <UserPlus className="h-3 w-3" />
                      Add TA
                    </button>
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
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Students ({students.length})</h4>
                    </div>
                    <button
                      onClick={() => openAddParticipantModal('student')}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <UserPlus className="h-3 w-3" />
                      Add Student
                    </button>
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

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Assignment</h3>
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="assignmentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Name *
                </label>
                <input
                  type="text"
                  id="assignmentName"
                  value={assignmentForm.name}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, name: e.target.value })}
                  placeholder="Enter assignment name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="assignmentDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="assignmentDescription"
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  placeholder="Enter assignment description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Points *
                </label>
                <input
                  type="number"
                  id="maxPoints"
                  value={assignmentForm.maxPoints}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, maxPoints: e.target.value })}
                  placeholder="Enter maximum points"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                onClick={handleCreateAssignment}
                disabled={!assignmentForm.name.trim() || !assignmentForm.dueDate || !assignmentForm.maxPoints}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Upload Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add {participantType === 'ta' ? 'Teaching Assistant' : 'Student'}
              </h3>
              <button
                onClick={handleCancelAddParticipant}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="participantEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="participantEmail"
                  required
                  value={participantForm.email}
                  onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                  placeholder={`Enter ${participantType === 'ta' ? 'TA' : 'student'} email`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  {participantType === 'ta' 
                    ? 'The TA will be added to the course and will be able to grade assignments and assist students.'
                    : 'The student will be enrolled in the course and will be able to view assignments and submit their work.'
                  }
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelAddParticipant}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddParticipant}
                disabled={!participantForm.email.trim()}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  participantType === 'ta' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}>
                Add {participantType === 'ta' ? 'TA' : 'Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}