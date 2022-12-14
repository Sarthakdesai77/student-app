const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teacher'
    },
    subject: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = mongoose.model("student", studentSchema)