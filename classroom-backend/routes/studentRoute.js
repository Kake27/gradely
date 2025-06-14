import { Router } from "express";
import Student from "../models/student.js";

const studenRouter = Router();

studenRouter.post("/createStudent", async (req, res) => {
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

studenRouter.get("/getStudentID", async (req, res) => {
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

studenRouter.post("/addCourse", async (req, res) => {
    const {courseId, studentId} = req.body

    try {
        if(!courseId || studentId) return res.status(400).json({error: "Course ID and Student ID both are required!"})

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

export default studenRouter