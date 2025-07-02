import { Router } from "express";
import Solution from "../models/solutions.js";
import Student from "../models/student.js";
import Assignment from "../models/assignment.js";
import mongoose from "mongoose";


const submissionRouter = Router();

submissionRouter.post("/submitSolution", async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const solution = new Solution({
            filename: req.body.filename,
            url: req.body.url,
            assignment: req.body.assignmentId,
            student: req.body.studentId
        })

        await solution.save({session});

        await Student.findByIdAndUpdate(req.body.studentId, {
            $push: { submissions: solution._id }
        }, { session })

        await Assignment.findByIdAndUpdate(req.body.assignmentId, {
            $push: { submissions: solution._id }
        }, { session })

        await session.commitTransaction();
        res.status(201).json({submissions: solution});
    }
    catch(err) {
        await session.abortTransaction();
        console.error(err);
        res.status(500).json({ error: "Failed to save submission data" });
    }
    finally {
        session.endSession();
    }
})

export default submissionRouter