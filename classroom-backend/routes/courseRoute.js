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

courseRouter.post("/addTA", async(req, res) => {
    const {courseId, taId} = req.body
    try {
        if(!courseId || !taId) return res.status(400).json({error: "Course ID and TA ID are required!"})
        
        const course = await Course.findById(courseId)
        course.tas.push(taId)
        await course.save()

        res.status(200).json({message: "TA added to course successfully!"})
    }
    catch(err) {
        console.error("Error adding TA: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default courseRouter