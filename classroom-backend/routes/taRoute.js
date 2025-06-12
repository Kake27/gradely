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

taRouter.get("/getTAID", async (req, res) => {
    try {
        const {email} = req.query
        const ta = await TA.findOne({email})

        res.status(200).json(ta._id)
        console.log("TA ID retrieved successfully")
    }
    catch(err) {
        console.log("Error retrieving faculty ID: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default taRouter;