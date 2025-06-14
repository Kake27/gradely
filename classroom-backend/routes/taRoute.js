import { Router } from "express";
import TA from "../models/ta.js";

const taRouter = Router();

taRouter.post("/createTA", async (req, res) => {
    try {
        const ta  = await TA.create(req.body);
        res.status(201).json(ta)
        console.log("TA created successfully in DB")
    }
    catch(err) {
        console.log("Error creating TA in DB: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

taRouter.get("/getTAData", async(req, res) => {
    try {
        const {email} = req.query;
        const ta = await TA.findOne({email})
        res.status(200).json(ta)

        console.log("TA data obtained succesfully.")
    }
    catch(err) {
        console.log("Error retrieving TA data: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})


taRouter.get("/getTAID", async (req, res) => {
    try {
        const {email} = req.query
        const ta = await TA.findOne({email})

        if(!ta) res.json(null)

        res.status(200).json(ta._id)
        console.log("TA ID retrieved successfully")
    }
    catch(err) {
        console.log("Error retrieving TA ID: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

taRouter.post("/addCourse", async (req, res) => {
    const {taId, courseId} = req.body
    try {
        if(!courseId || !taId) return res.status(400).json({error: "Course ID and TA ID are required!"})

        const ta = await TA.findById(taId)

        if(!ta.courses.includes(courseId)) {
            ta.courses.push(courseId)
            await ta.save()
            res.status(200).json({message: "Course added succesfully to TA!"})
        }
        else {
            res.json({error: "Course has already been added!"})
        }
    }
    catch(err) {
        console.log("Error adding course to TA: ", err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default taRouter;