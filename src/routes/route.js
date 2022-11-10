const express = require('express')
const router = express.Router()
const teacherController = require('../controller/teacherController')
const studentController = require('../controller/studentController')
const auth = require('../middleware/auth')


router.post('/register', teacherController.teacherRegistration)
router.post('/login', teacherController.teacherLogin)

router.post('/addStudent', studentController.addStudent)
router.get('/getStudents', studentController.getStudents)

module.exports = router