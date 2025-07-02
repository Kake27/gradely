import {mongoose, Schema} from 'mongoose'

const solutionSchema = new Schema(
    {
        filename: {type: String, default: 'Solution'},
        url: {type: String, required: true},
        assignment: {type: Schema.Types.ObjectId, ref: 'Assignment', required: true},
        student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
        status: {
            type: String,
            enum: ['pending', 'graded', 'overdue'],
            default: 'pending'
        },
        submittedDate: {type: Date, default: Date.now},
        grade: {type: String, default: ''},
        marks: {type: Number, default: 0},
        feedback: {type: String, default: ''},
        gradedBy: {type: Schema.Types.ObjectId, ref: 'TA', default: null},
        reevalRequested: {type: Boolean, default: false},
    },
    {
        collection: 'solutions'
    }
)

const Solution = mongoose.models.Solution || mongoose.model('Solution', solutionSchema)
export default Solution