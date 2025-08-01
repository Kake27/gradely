import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, User, Calendar, Eye,Save,Send,X,CheckCircle,} from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../context/ContextProvider';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';


// PDF Viewer Component
function PdfViewer(pdfUrl) {
  return (
    <iframe
      src={pdfUrl.pdfUrl}
      title="Assignment PDF"
      width="100%"
      height="600px"
      style={{ border: "none", borderRadius: "8px" }}
    ></iframe>
  );
}

// Submission Viewer Component (placeholder for actual file content)
function SubmissionViewer( {submission} ) {
  return (
    <div className="w-full h-96 bg-gray-100 border-2 border-dashed mx-auto
                 border-gray-300 rounded-lg flex items-center justify-center">
      <div className="w-full h-full text-center py-auto">
        {/* <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600 mb-2">Student Submission</p> */}
        
        <iframe
          src={submission.url}
          title="Student Submission"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default function CheckSolution() {
  const { submissionId } = useParams();
  const {user, loading} = useContext(UserContext)
  const navigate = useNavigate();
  const location = useLocation();

  // Page State
  const [showAssignmentPdf, setShowAssignmentPdf] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
    const [gradingForm, setGradingForm] = useState({
      grade: '',
      totalPoints: 0,
      feedback: '',
      rubricScores: {} 
    });

  // Page Data
  const [submissionData, setSubmissionData] = useState([])
  const [assignmentData, setAssignmentData] = useState([])

  useEffect( () => {
    if(loading) return;

    const fetchData = async() => {  
      try {
        const submissionRes = await axios.get(`http://localhost:5000/submission/getSolution/${submissionId}`)
        setSubmissionData(submissionRes.data.submission)
        setAssignmentData(submissionRes.data.submission.assignment)
      }
      catch(err) {
        console.log("Error fetching submission data: ", err);
        return
      }
    }

    if(user) fetchData()

  }, [loading, user, submissionId])


  const returnPath = location.state?.returnPath || '/ta';
  const userRole = location.state?.role; 


  const gradingRubric = [
    {
      id: '1',
      criteria: 'Code Correctness',
      description: 'Implementation works correctly for all test cases',
      maxPoints: 40,
      weight: 0.4
    },
    {
      id: '2',
      criteria: 'Code Quality',
      description: 'Clean, readable, and well-structured code',
      maxPoints: 25,
      weight: 0.25
    },
    {
      id: '3',
      criteria: 'Algorithm Efficiency',
      description: 'Optimal time and space complexity',
      maxPoints: 20,
      weight: 0.2
    },
    {
      id: '4',
      criteria: 'Documentation',
      description: 'Proper comments and documentation',
      maxPoints: 15,
      weight: 0.15
    }
  ];

  const handleBack = () => {
    navigate(returnPath);
  };

  const handleViewAssignmentPdf = () => {
    if (assignmentData.url) {
      setSelectedPdfUrl(assignmentData.url);
      setShowAssignmentPdf(true);
    }
  };

  const handleClosePdfViewer = () => {
    setShowAssignmentPdf(false);
    setSelectedPdfUrl('');
  };

  const handleRubricScoreChange = (rubricId, score) => {
    setGradingForm(prev => ({
      ...prev,
      rubricScores: {
        ...prev.rubricScores,
        [rubricId]: score
      }
    }));
  };

  const calculateTotalFromRubric = () => {
    let total = 0;
    gradingRubric.forEach(rubric => {
      const score = parseFloat(gradingForm.rubricScores[rubric.id] || '0');
      total += score;
    });
    return total;
  };

  const handleSaveDraft = () => {
    // Save as draft logic here
    console.log('Saving draft:', gradingForm);
    toast.success('Draft saved successfully!');
  };

  const handleSubmitGrade = async () => {
    if (!gradingForm.grade || !gradingForm.totalPoints) {
      toast.alert('Please fill in all required fields (grade, points, and feedback).');
      return;
    }

    console.log(gradingForm)
    try {
      const gradingRes = await axios.put(`http://localhost:5000/submission/gradeSolution/${submissionId}`, {
        grade: gradingForm.grade,
        marks: gradingForm.totalPoints,
        feedback: gradingForm.feedback,
        taId: user.id
      })

      if(gradingRes.data.error) {
        console.log("An error occured!")
        return;
      }

      toast.success('Submission graded successfully');
      navigate(returnPath);
    }
    catch (err) {
      console.log("Error grading submission: ", err)
      return;
    }
    

    // Submit grade logic here
    // console.log('Submitting grade:', {
    //   submissionId,
    //   ...gradingForm,
    //   rubricTotal: calculateTotalFromRubric()
    // });
    

  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'border-green-500 text-green-700';
    if (grade.startsWith('B')) return 'border-blue-500 text-blue-700';
    if (grade.startsWith('C')) return 'border-yellow-500 text-yellow-700';
    if (grade.startsWith('D')) return 'border-orange-500 text-orange-700';
    return 'border-red-500 text-red-700';
  };

  const isOverdue = (submissionDate) => {
    return new Date(submissionDate) < new Date()
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
                <h1 className="text-3xl font-bold text-gray-900">Grade Submission</h1>
                <p className="text-gray-600">{userRole === 'faculty' ? 'Faculty' : 'Teaching Assistant'} View</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Submission Details & Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Submission Info Card */}
            <div className="bg-white rounded-lg shadow p-6 h-120">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{assignmentData.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />

                      {submissionData?.student?.name} 
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Submitted: {new Date(submissionData.submittedDate).toLocaleDateString()}
                    </span>
                    {isOverdue(submissionData.submittedDate) ? (
                      <span className='text-red-600 font-semibold'> Overdue</span>
                    ): <span className='text-green-600 font-semibold'>On Time</span>}
                    <a className="flex items-center gap-1 underline text-blue-600 cursor-pointer"
                        href={submissionData.url} download target='_blank' rel='noopener norefferrer'>
                      <FileText className="h-4 w-4" />
                      {submissionData.filename}
                    </a>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                  {assignmentData.url && (
                    <button
                      onClick={handleViewAssignmentPdf}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Assignment
                    </button>
                  )}
                  {/* {submissionData.url && (
                    <a className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                       href={submissionData.url} download target='_blank' rel='noopener norefferrer'>
                      <Download className="h-4 w-4" />
                      Download File
                    </a>
                  )} */}
                </div>
              </div>

              {/* Submission Content Viewer */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Submission</h3>
                <SubmissionViewer submission={submissionData} />
              </div>
            </div>

            {/* Grading Rubric */}
            {/* <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Grading Rubric
              </h3>
              <div className="space-y-4"> */}
                {/* {gradingRubric.map((rubric) => (
                  <div key={rubric.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{rubric.criteria}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rubric.description}</p>
                        <span className="text-xs text-gray-500">
                          Max Points: {rubric.maxPoints} ({(rubric.weight * 100).toFixed(0)}% weight)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 lg:min-w-0 lg:w-32">
                        <input
                          type="number"
                          min="0"
                          max={rubric.maxPoints}
                          step="0.5"
                          value={gradingForm.rubricScores[rubric.id] || ''}
                          onChange={(e) => handleRubricScoreChange(rubric.id, e.target.value)}
                          placeholder="0"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                        />
                        <span className="text-sm text-gray-500">/ {rubric.maxPoints}</span>
                      </div>
                    </div>
                  </div>
                ))} */}
                
                {/* Rubric Total */}
                {/* <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Rubric Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {calculateTotalFromRubric().toFixed(1)} / {assignmentData.marks}
                    </span>
                  </div>
                </div> */}
              {/* </div>
            </div> */}
          </div>

          {/* Right Column - Grading Form */}
          <div className="space-y-6">
            {/* Grading Form */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Grade Assignment
              </h3>

              <div className="space-y-6">
                {/* Letter Grade */}
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Grade *
                  </label>
                  <select
                    id="grade"
                    value={gradingForm.grade}
                    onChange={(e) => setGradingForm({ ...gradingForm, grade: e.target.value })}
                    className={`w-1/2 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      gradingForm.grade ? getGradeColor(gradingForm.grade) : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                {/* Numerical Score */}
                <div>
                  <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Points *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="totalPoints"
                      min="0"
                      max={submissionData.maxPoints}
                      step="0.5"
                      value={gradingForm.totalPoints}
                      onChange={(e) => setGradingForm({ ...gradingForm, totalPoints: e.target.value })}
                      placeholder="Enter points"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="ml-[10px] left top-2 text-md text-gray-500">
                      / {assignmentData.marks}
                    </span>
                  </div>
                  {calculateTotalFromRubric() > 0 && (
                    <button
                      onClick={() => setGradingForm({ ...gradingForm, totalPoints: calculateTotalFromRubric().toString() })}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Use rubric total ({calculateTotalFromRubric().toFixed(1)})
                    </button>
                  )}
                </div>

                {/* Feedback */}
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback 
                  </label>
                  <textarea
                    id="feedback"
                    value={gradingForm.feedback}
                    onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                    placeholder="Provide detailed feedback on the student's work..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {gradingForm.feedback.length}/200 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSaveDraft}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSubmitGrade}
                    disabled={!gradingForm.grade || !gradingForm.totalPoints}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Submit Grade
                  </button>
                </div>

                {/* Grading Tips */}
                {/* <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Grading Tips
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Be specific and constructive in your feedback</li>
                    <li>• Use the rubric to ensure consistent grading</li>
                    <li>• Highlight both strengths and areas for improvement</li>
                    <li>• Save drafts frequently while grading</li>
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment PDF Viewer Modal */}
      {showAssignmentPdf && (
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
  );
}