const {Router} = require("express")
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router()
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config");

router.post('/signup', async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username,
        password
    })
    
    res.json({
        message: 'Admin created succussfully'
    })
});

router.post('/signin', async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    const user = await Admin.find({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({username}, JWT_SECRET)
        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and password"
        })
    }
})

router.post('/courses', adminMiddleware, async (req, res)=> {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;

    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: "Course created successfully",
        courseId: newCourse._id
    })
})

router.get('/courses', adminMiddleware, async (req, res)=> {
    const allCourses = await Course.find({})
    res.json({
        courses: allCourses
    })
})

module.exports = router