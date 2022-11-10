const studentModel = require('../models/studentModel')

const addStudent = async (req, res) => {
    try {
        const userId = req.params.userId;
        const body = req.body;
        let { name, subject, marks } = body;

        if (!name) return res.status(400).send({ status: false, message: 'Please enter name' })
        if (!subject) return res.status(400).send({ status: false, message: 'Please enter subject' })
        if (!marks) return res.status(400).send({ status: false, message: 'Please enter marks' })

        let student = await studentModel.findOne({ name, subject, teacherId: userId, isDeleted: false });
        if (student) {
            student.marks += marks;
            student.save();
            return res.status(200).send({ status: true, message: 'marks added successfully', data: student });
        } else {
            body.teacherId = userId;
            let newStudent = await studentModel.create(body);
            return res.status(201).send({ status: true, message: 'student added successfully', data: newStudent });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getStudents = async (req, res) => {
    try {
        const userId = req.params.userId;
        const name = req.query.name;
        const subject = req.query.subject;
        let marks = req.query.marks;

        let filter = { teacherId: userId, isDeleted: false };

        if (name) filter.name = { $regex: name.trim(), $options: 'i' }
        if (subject) filter.subject = { $regex: subject.trim(), $options: 'i' }
        if (marks) {
            marks = parseInt(marks);
            filter.marks = marks;
        }

        let students = await studentModel.find(filter)
        if(students.length==0) return res.status(404).send({status: false, message: 'No data found'})

        return res.status(200).send({ status: true, message: 'list of students', data: students });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateStudent = async (req, res) => {
    try {
        const userId = req.params.userId;
        const id = req.params.id;
        const body = req.body;
        let { name, subject, marks } = body;

        if (name) {
            let uniqueName = await studentModel.findOne({ name, teacherId: userId, isDeleted: false });
            if (uniqueName) {
                return res.status(400).send({ status: false, message: 'Name should be unique' });
            }
        }

        let update = await studentModel.findOneAndUpdate({ _id: id, teacherId: userId, isDeleted: false }, { name, subject, marks }, { new: true })

        return res.status(200).send({ status: true, message: 'data updated successfully', data: update });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const userId = req.params.userId;
        const id = req.params.id;

        let student = await studentModel.findOne({ _id: id, teacherId: userId, isDeleted: false });
        if (!student) return res.status(404).send({ status: false, message: 'student already deleted or no student found for this teacher' });

        await studentModel.findOneAndUpdate({ _id: id }, { isDeleted: true });

        return res.status(204).send({ status: true, message: 'successfully deleted' });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { addStudent, getStudents, updateStudent, deleteStudent }