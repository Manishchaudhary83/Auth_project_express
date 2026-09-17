const dotenv = require("dotenv")
dotenv.config()
const app = require("./src/app")

const connectDb  = require("./src/db/db")
connectDb()

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on the port  ${PORT}`)
})
