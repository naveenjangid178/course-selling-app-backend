const express = require("express")
const bodyParser = require("body-parser")
const adminRoute = require("./routes/admin")
const userRoute = require("./routes/user")

const app = express()

app.use(bodyParser.json())
app.use("/admin", adminRoute)
app.use("/user", userRoute)

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);    
});