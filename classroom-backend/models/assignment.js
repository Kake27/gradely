import {mongoose, Schema} from "mongoose";

const assignmentSchema = new Schema( 
    {
        title: {type: String, required: true},
        description: {type: String},
        url: {type: String, required: true},
        marks: {type: Number, default: 100},
        course: {type: Schema.Types.ObjectId, ref:'Course', required: true},
        submissions: [{type:Schema.Types.ObjectId, ref:'Submission'}],
        rubrics : {type: Schema.Types.ObjectId, ref:'Rubrics'},
        dueDate: {type: Date, default: null},
        
    } ,{
        collection: 'assignments'
    }
)

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema)
export default Assignment