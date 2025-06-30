import {mongoose, Schema} from 'mongoose'

const solutionSchema = new Schema(
    {
        url: {type: String, required: true},
        assignment: {type: Schema.Types.ObjectId, ref: 'Assignment', required: true},
        student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
        grade: {type: Number, default: 0},
        feedback: {type: String, default: ''},
        gradedBy: {type: Schema.Types.ObjectId, ref: 'TA'},
        reevalRequested: {type: Boolean, default: false},
    }
)