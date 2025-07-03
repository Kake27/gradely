import { json, Router } from "express";
import Solution from "../models/solutions.js";
import Student from "../models/student.js";
import Assignment from "../models/assignment.js";
import mongoose from "mongoose";
import TA from "../models/ta.js";


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

submissionRouter.get("/getSolution/:solutionId", async(req, res) => {
    try {
        if(!req.params.solutionId) return res.status(400).json({error: "Submission ID required!"}); 

        const submission = await Solution.findById(req.params.solutionId).populate({path: 'assignment'}).populate(
            {path: 'student',select: 'name'})

        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        return res.status(200).json({ submission: submission });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get submission data" });
    }
})

submissionRouter.put("/gradeSolution/:solutionId", async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {solutionId} = req.params
        const {grade, marks, feedback, taId} = req.body

        if(!solutionId) return res.status(400).json({error: "Solution ID missing"})

        const updatedSolution = await Solution.findByIdAndUpdate(solutionId,
            {
                grade, 
                marks, 
                feedback,
                gradedBy: taId,
                checkedDate: new Date(),
                status: "graded"
            },
                {new: true},
                {session}
            )

        if (!updatedSolution) {
            return res.status(404).json({ error: "Solution not found" });
        }

        await TA.findByIdAndUpdate(
            taId,
            {$addToSet: {checked: updatedSolution._id}}, {session}
        )

        await session.commitTransaction();
        return res.status(200).json({message: "Solution graded successfully"})
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to grade submission" });
    }
    finally {
        session.endSession()
    }
})
export default submissionRouter