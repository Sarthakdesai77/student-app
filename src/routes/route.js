const express = require('express')
const router = express.Router()
const teacherController = require('../controller/teacherController')
const studentController = require('../controller/studentController')
const auth = require('../middleware/auth')


router.post('/register', teacherController.teacherRegistration)
router.post('/login', teacherController.teacherLogin)

router.get('/getStudents/:userId', auth.authentication, studentController.getStudents)
router.post('/addStudent/:userId', auth.authentication, auth.authorization, studentController.addStudent)
router.put('/updateStudents/:userId/:id', auth.authentication, auth.authorization,studentController.updateStudent)
router.delete('/deleteStudents/:userId/:id', auth.authentication, auth.authorization, studentController.deleteStudent)

module.exports = router