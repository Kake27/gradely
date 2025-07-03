import { Router } from "express";
import Course from "../models/courses.js";

const courseRouter = Router()

courseRouter.post("/createCourse", async(req, res) => {
    try {
        const course = await Course.create(req.body)
        res.status(201).json(course)
        console.log("Course created successfully in DB")
    }   
    catch(err) {
        console.log("Error creating course in DB: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

courseRouter.get("/getFaculty/:courseId", async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('faculty').populate('tas').populate('students')
        if(!course) return res.status(404).json({error: "Course not found"})

        res.json(course)
    }
    catch(err) {
        console.error("Error fetching course: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

courseRouter.get("/getTA/:courseId", async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('faculty').populate('tas').populate('students')

        if(!course) return res.status(404).json({error: "Course not found"})

        res.json(course)
    }
    catch(err) {
        console.error("Error fetching course: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

courseRouter.get("/getStudent/:courseId", async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('faculty').populate('tas').populate('students')
        if(!course) return res.status(404).json({error: "Course not found"})

        res.json(course)
    }
    catch(err) {
        console.error("Error fetching course: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})


courseRouter.post("/addTA", async(req, res) => {
    const {courseId, taId} = req.body
    try {
        if(!courseId || !taId) return res.status(400).json({error: "Course ID and TA ID are required!"})
        
        const course = await Course.findById(courseId)

        if(!course.tas.includes(taId)) {
            course.tas.push(taId)
            await course.save()

            res.status(200).json({message: "TA added to course successfully!"})
        }
        else {
            res.json({error: "This TA has already been assigned!"})
        }

    }
    catch(err) {
        console.error("Error adding TA: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

courseRouter.post("/addStudent", async (req, res) => {
    const {courseId, studentId} = req.body

    try {
        if(!courseId || !studentId) return res.status(400).json({error: "Course ID and Student ID both are required!"})

        const course = await Course.findById(courseId)
        if(!course.students.includes(studentId)) {
            course.students.push(studentId)
            await course.save()
            res.status(200).json({message: "Student added to course successfully!"})
        }
        else {
            res.json({error: "This student has already been added!"})
        }
    }
    catch(err) {

    }
})

courseRouter.post("/addAssignment", async (req, res) => {
    const {courseId, assignmentId} = req.body
    try{
        if(!courseId || !assignmentId) return res.status(400).json({error: "Course ID and Assignment ID both are required!"})
        
        const course = await Course.findById(courseId)
        course.assignments.push(assignmentId)
        await course.save()
        res.status(200).json({message: "Assignment added to course successfully!"});

    }
    catch(err) {
        console.error("Error adding assignment: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

courseRouter.get("/getAssignments/:courseId", async(req, res) => {
    try {
        if(!req.params.courseId) return res.status(400).json({error: "Course ID is required"})
        
        const course = await Course.findById(req.params.courseId).populate({
            path: 'assignments',
            populate: [{
                path: 'submissions',
                populate: [{
                    path: 'student',
                    field: 'name'
                }]
            }]
        })

        if(!course) return res.status(404).json({error: "Course not found"})

        const processedAssignments = course.assignments.map(assignment => {
            const gradedSubmissions = [];
            const ungradedSubmissions = [];

            assignment.submissions.forEach(sub => {
                if (sub.status === "graded") {
                    gradedSubmissions.push(sub);
                } else {
                    ungradedSubmissions.push(sub);
                }
            });

            return {
                _id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                url: assignment.url,
                marks: assignment.marks,
                gradedSubmissions,
                ungradedSubmissions
            };
        });

        return res.status(200).json({assignments: processedAssignments})
    }
    catch(err) {
        console.error("Error fetching assignments: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})


export default courseRouter