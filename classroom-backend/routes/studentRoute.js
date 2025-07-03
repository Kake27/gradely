import { Router } from "express";
import Student from "../models/student.js";
import Assignment from "../models/assignment.js";
import Solution from "../models/solutions.js";

const studentRouter = Router();

studentRouter.post("/createStudent", async (req, res) => {
    try {
        const student  = await Student.create(req.body);
        res.status(201).json(student)
        console.log("Student created successfully in DB")
    }
    catch(err) {
        console.log("Error creating student in DB: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

studentRouter.get("/getStudentID", async (req, res) => {
    try {
        const {email} = req.query
        const student = await Student.findOne({email})

        if(!student) res.json(null)

        res.status(200).json(student._id)
        console.log("Student ID retrieved successfully")
    }
    catch(err) {
        console.log("Error retrieving student ID: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

studentRouter.post("/addCourse", async (req, res) => {
    const {courseId, studentId} = req.body

    try {
        if(!courseId || !studentId) return res.status(400).json({error: "Course ID and Student ID both are required!"})

        const student = await Student.findById(studentId);

        if(!student.courses.includes(courseId)) {
            student.courses.push(courseId)
            await student.save()
            res.status(200).json({message: "course added successfully to student!"})
        }
        else {
            res.json({error: "Course has already been added!"})
        }
    }
    catch(err) {
        console.log("Error adding course to student: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

studentRouter.get("/getCourses/:studentId", async(req, res) => {
    try {
        if(!req.params.studentId) return res.status(400).json({error: "Student ID required!"});

        const student = await Student.findById(req.params.studentId).populate({
            path: 'courses', 
            populate: [{
                path: 'faculty',
                select: 'name email'
            },
            {
                path: 'assignments',
            }
        ]
        }).lean()
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const allAssignments = [];
        student.courses.forEach(course => {
            course.assignments.forEach(assignment => {
                allAssignments.push(assignment._id)
            })
        });


        const submissions = await Solution.find({
            student: req.params.studentId,
            assignment: {$in: allAssignments}
        })

        const submissionMap = new Map();
        submissions.forEach(sub => {
            submissionMap.set(sub.assignment.toString(), sub.submittedDate);
        });

        const now = new Date()

        student.courses.forEach(course => {
        course.assignments = course.assignments.map(assignment => {
            const idStr = assignment._id.toString();

            if (submissionMap.has(idStr)) {
                assignment.status = "submitted";
            } else if (assignment.dueDate && new Date(assignment.dueDate) < now) {
                assignment.status = "overdue";
            }
            else assignment.status = "pending";

            return assignment
        });
        });

        res.status(200).json({ courses: student.courses });
    }
    catch(err) {
        console.error("Error getting courses: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

studentRouter.get("/:studentId/course/:courseId/submissions", async (req, res) => {
    try {
        const { studentId, courseId } = req.params;
        if (!studentId || !courseId) return res.status(400).json({ error: "Student ID and Course ID are required!" });
        
        const assignments = await Assignment.find({course: courseId}).select('_id')
        const assignmentIds = assignments.map(assignment => assignment._id);

        const submissions = await Solution.find({
            assignment: { $in: assignmentIds },
            student: studentId
        }).populate('assignment', 'title marks')

        const submittedAssignments = submissions.map(sub => sub.assignment._id)

        res.status(200).json({submissions, submittedAssignments})
    }

    catch(err) {
        console.error("Error getting courses: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

studentRouter.get("/submissions/:studentId", async (req, res) => {
    try {
        if(!req.params.studentId) return res.status(400).json({error: "Student ID required!"})

        const submissions = await Solution.find({student: req.params.studentId}).populate({
            path: 'assignment',
            populate:{
                path: 'course',
                select: 'name'
            }
        })

        res.status(200).json({submissions: submissions})
    }
    catch(err) {
        console.error("Error getting submissions: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

export default studentRouter;