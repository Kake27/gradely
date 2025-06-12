import {mongoose, Schema} from "mongoose";

const courseSchema = new Schema(
    {
        name: {type: String, required: true},
        faculty: {type: Schema.Types.ObjectId, ref:'Faculty', required: true},
        tas: [{type: Schema.Types.ObjectId, ref:'TA'}],
        students: [{type: Schema.Types.ObjectId, ref:'Student'}],
        noOfStudents: {type: Number, default: 0},
        assignments: [{type: Schema.Types.ObjectId, ref:'Assignment'}],
    }, 
    {
        collection: 'courses'
    }
)

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema)
export default Course