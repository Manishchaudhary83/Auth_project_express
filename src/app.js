const express = require("express")
const authRoutes = require("./routes/auth.routes")

const app = express()

//json middleware
app.use(express.json())


//prefix
app.use("/api/auth", authRoutes)

app.use((error, req, res, next) => {
    res.status(error.status ?? 500).json({
        message: error.message ?? "Intrenal server error"
    })
})

module.exports = app
