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

        res.status(200).json({id: student._id})
        console.log("Student ID retrieved successfully")
    }
    catch(err) {
        console.log("Error retrieving student ID: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default studenRouter