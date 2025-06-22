import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from "dotenv"

import facultyRouter from './routes/facultyRoute.js'
import studenRouter from './routes/studentRoute.js'
import taRouter from './routes/taRoute.js'
import courseRouter from './routes/courseRoute.js'
import assignmentRouter from './routes/assignment.js'


const app = express()
app.use(cors())
app.use(express.json())

dotenv.config()

mongoose.connect(process.env.CLASSROOM_DB_URI)

// Routes
app.use("/faculty", facultyRouter)
app.use("/student", studenRouter)
app.use("/ta", taRouter)
app.use("/course", courseRouter)
app.use("/assignment", assignmentRouter)


app.listen(5000, ()=> {
    console.log("Server is running")
})