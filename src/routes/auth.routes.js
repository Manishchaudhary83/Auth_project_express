const express = require("express")
const {registerUserController, loginUserController, logoutUserController } = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {registerUserValidationRules, loginUserValidationRules} = require("../middlewares/validate.middleware")

const router = express.Router()

//API
router.post("/register", registerUserValidationRules, registerUserController)
router.post("/login", loginUserValidationRules, loginUserController)
router.post("/logout", authMiddleware, logoutUserController)


module.exports = router
