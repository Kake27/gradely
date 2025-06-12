import {mongoose, Schema} from "mongoose";

const taSchema = new Schema(
    {
        name: {type: String, required: true},
        email: { type: String, unique: true, required: true },
        courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
        faculty: [{type: Schema.Types.ObjectId, ref: 'Faculty'}]
    }, 
    {
        collection: 'ta'
    }
)

const TA = mongoose.models.TA || mongoose.model("TA", taSchema)
export default TA