import { Router } from 'express'
import Faculty from '../models/faculty.js'

const facultyRouter = Router()

facultyRouter.post("/createFaculty",  async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body)
        res.status(201).json(faculty)
        console.log("Faculty created successfully in DB")
    }
    catch(err) {
        console.log("Error creating faculty in DB: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }

})

facultyRouter.get("/getFacultyID", async (req, res) => {
    try {
        const {email} = req.query
        const faculty = await Faculty.findOne({email})

        res.status(200).json(faculty._id)
        console.log("Faculty ID retrieved successfully")
    }
    catch(err) {
        console.log("Error retrieving faculty ID: ", err);
        res.status(500).json({error: "Internal Server Error"})
    }
})

facultyRouter.post("/addCourse", async (req, res) => {
    const {facultyId, courseId} = req.body;
    try {
        if(!facultyId || !courseId) return res.status(400).json({error: "Faculty ID and Course ID both are required!"});

        const faculty = await Faculty.findById(facultyId)

        faculty.courses.push(courseId);
        await faculty.save()
        res.status(200).json({ message: "Course added to faculty successfully", faculty });
        
    }
    catch(err) {
        console.error("Error adding course to faculty: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

facultyRouter.get("/getCourses/:facultyId", async (req, res) => {
    try {
        if(!req.params.facultyId) return res.status(400).json({error: "Faculty ID required!"});

        const faculty = await Faculty.findById(req.params.facultyId).populate('courses')
        if (!faculty) {
            return res.status(404).json({ error: "Faculty not found" });
        }

        res.status(200).json({ courses: faculty.courses });
    }
    catch(err) {
        console.error("Error getting courses: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})
 

export default facultyRouter