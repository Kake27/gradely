import { Router } from "express";
import Assignment from "../models/assignment.js";
import Course from "../models/courses.js"
import Faculty from "../models/faculty.js"
import mongoose from "mongoose";

const assignmentRouter = Router()

assignmentRouter.post("/createAssignment", async (req, res) => {
    const { assignmentData, courseId, facultyId } = req.body;

    if (!assignmentData || !courseId || !facultyId) {
        return res.status(400).json({ error: "Missing required data" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const assignment = new Assignment(assignmentData);
        const savedAssignment = await assignment.save({session})

        const course = await Course.findByIdAndUpdate(
            courseId,
            {$push: {assignments: savedAssignment._id}},
            {new: true, session}
        )

        if(!course) return res.status(400).json({error: "Course not found"})

        
        const faculty = await Faculty.findByIdAndUpdate(
            facultyId,
            {$push: {assignments: savedAssignment._id}},
            {new: true, session}
        )

        if(!faculty) return res.status(400).json({error: "Faculty not found"})
        await session.commitTransaction()


        res.status(200).json(savedAssignment);
    }
    catch(err) {
        await session.abortTransaction()
        console.error(err);
        res.status(500).json({ error: "Failed to save assignment data" });
    }
    finally {
        await session.endSession()
    }
})

export default assignmentRouter