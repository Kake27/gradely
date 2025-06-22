import {mongoose, Schema} from "mongoose";

const rubricSchema = new Schema(

)

const Rubric = mongoose.models.Rubric || mongoose.model("Rubric", rubricSchema)
export default Rubric