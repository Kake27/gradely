import { Router } from "express";
import Assignment from "../models/assignment.js";

const assignmentRouter = Router()

assignmentRouter.post("/createAssignment", async (req, res) => {
    try {
        const assignment = new Assignment({
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            marks: req.body.marks || 0,
            course: req.body.courseId,
            dueDate: req.body.dueDate || null
        });

        await assignment.save();
        res.status(200).json(assignment);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save assignment data" });
    }
})

export default assignmentRouter