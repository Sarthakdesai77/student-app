const studentModel = require('../models/studentModel')
const mongoose = require('mongoose');

const addStudent = async (req, res) => {
    try {
        const body = req.body;
        let { name, subject, marks } = body;

        if (!name) return res.status(400).send({ status: false, message: 'Please enter name' })
        if (!subject) return res.status(400).send({ status: false, message: 'Please enter subject' })
        if (!marks) return res.status(400).send({ status: false, message: 'Please enter marks' })

        let student = await studentModel.findOne({ name, subject, isDeleted: false });
        if (student) {
            student.marks += marks;
            student.save();
            return res.status(200).send({ status: true, message: 'marks added successfully', data: student });
        } else {
            let newStudent = await studentModel.create(body);
            return res.status(201).send({ status: true, message: 'student added successfully', data: newStudent });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getStudents = async (req, res) => {
    try {
        const name = req.query.name;
        const subject = req.query.subject;
        let marks = req.query.marks;
    
        let filter = { isDeleted: false };
    
        if (name) filter.name = { $regex: name.trim(), $options: 'i' }
        if (subject) filter.subject = { $regex: subject.trim(), $options: 'i' }
        if (marks) {
            marks = parseInt(marks);
            filter.marks = marks;
        }
    
        let students = await studentModel.find(filter)
    
        return res.status(200).send({ status: true, message: 'list of students', data: students });
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { addStudent, getStudents }