const {Router} = require("express")
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const mongoose = require("mongoose")
const router = Router()

router.post('/signup', (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password
    })
    res.json({
        message: "User created successfully"
    })
})

router.post('/signin', async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
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

router.get('/courses', async (req, res)=> {
    const allCourses = await Course.find({})
    res.json({
        courses: allCourses
    })
})

router.post('/courses/:courseId', userMiddleware, async (req, res)=> {
    const courseId = req.params.courseId;
    const username = req.username;
    await User.updateOne({
        username
    }, {
        "$push": {
            purchasedCourses: new mongoose.Types.ObjectId(courseId)
        }
    })

    res.json({
        message: "Purchase complete"
    })
})

router.get('/purchasedCourses', userMiddleware, async (req, res)=> {
    const username = req.username;
    const user = await User.findOne({
        username
    });
    console.log(user.purchasedCourses)
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })

    res.json({
        courses: courses
    })
})

module.exports = router