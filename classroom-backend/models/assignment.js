import {mongoose, Schema} from "mongoose";

const assignmentSchema = new Schema( 
    {
        title: {type: String, required: true},
        url: {type: String, required: true},
        course: {type: Schema.Types.ObjectId, ref:'Course', required: true},
        faculty: {type: Schema.Types.ObjectId, ref:'Faculty', required: true},
        tas: [{type: Schema.Types.ObjectId, ref:'TA'}],
        dueDate: Date,
        
    }
)