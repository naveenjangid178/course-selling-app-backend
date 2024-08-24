const {Router} = require("express")
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { default: mongoose } = require("mongoose");
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

router.get('/courses', async (req, res)=> {
    const allCourses = await Course.find({})
    res.json({
        courses: allCourses
    })
})

router.post('/courses/:courseId', userMiddleware, async (req, res)=> {
    const courseId = req.params.courseId;
    const username = req.headers.username;
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
    const username = req.headers.username
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