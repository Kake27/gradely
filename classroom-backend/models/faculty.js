import {mongoose, Schema} from "mongoose";


const facultySchema = new Schema(
    {
        name: {type: String, required: true},
        email: { type: String, unique: true, required: true },
        courses: [{type: Schema.Types.ObjectId, ref:'Course'}],
        assignments: [{type: Schema.Types.ObjectId, ref:'Assignment'}], 
    }, 
    {
        collection: 'faculty'
    }
)

const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema)

export default Faculty