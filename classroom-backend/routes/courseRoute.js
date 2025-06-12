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
        const course = await Course.findById(req.params.courseId).populate('faculty')
        if(!course) return res.status(404).json({error: "Course not found"})

        res.json(course)
    }
    catch(err) {
        console.error("Error fetching course: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default courseRouter