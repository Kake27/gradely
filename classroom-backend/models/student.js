import {mongoose, Schema} from "mongoose";

const studentSchema = new Schema( 
    {
        name: {type: String, required: true},
        email: {type: String, unique: true, required: true},
        courses: [{type: Schema.Types.ObjectId, ref:'Course'}],
        solutions: [{type: Schema.Types.ObjectId, ref:'Solution'}]
    }, 
    {
        collection: 'student'
    }
)

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema)
export default Student