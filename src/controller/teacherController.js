const mongoose = require('mongoose')
const teacherModel = require('../models/teacherModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const teacherRegistration = async function (req, res) {
    try {
        let data = req.body
        let { name, phone, password, email } = data;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

        if (!name) return res.status(400).send({ status: false, message: 'Please enter name' })
        if (!phone) return res.status(400).send({ status: false, message: 'Please enter phone' })
        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })

        //-----------[Password encryption]
        const bcryptPassword = await bcrypt.hash(password, 10)
        data.password = bcryptPassword

        //------------------[Unique field check DB calls]
        const emailUnique = await teacherModel.findOne({ email })
        if (emailUnique) return res.status(400).send({ status: false, message: 'Already register Email' })

        const phoneUnique = await teacherModel.findOne({ phone })
        if (phoneUnique) return res.status(400).send({ status: false, message: "Already register Phone Number" })

        //------------[Document create]
        const teacher = await teacherModel.create(data)
        return res.status(201).send({ status: true, message: 'Registered Successfully', data: teacher })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const teacherLogin = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data
    
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })
    
        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
    
        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
    
        const Login = await teacherModel.findOne({ email })
        if (!Login) return res.status(404).send({ status: false, message: 'Not a register email Id' })
    
        //----------[Password Verification]
        let PassDecode = await bcrypt.compare(password, Login.password)
        if (!PassDecode) return res.status(401).send({ status: false, message: 'Password not match' })
    
        //----------[JWT token generate]
        let token = jwt.sign({
            userId: Login._id.toString()
        }, "x-api-secret", { expiresIn: '50d' })
    
        res.setHeader("x-api-key", token)
    
        return res.status(200).send({ status: true, message: 'User login successfull', data: { userId: Login._id, token: token } })
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { teacherRegistration, teacherLogin }