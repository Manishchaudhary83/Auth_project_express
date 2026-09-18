const express = require("express")
const {registerUserController, loginUserController, forgotPasswordController, resetPasswordController, logoutUserController } = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {registerUserValidationRules, loginUserValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules} = require("../middlewares/validate.middleware")

const router = express.Router()

//API
router.post("/register", registerUserValidationRules, registerUserController)
router.post("/login", loginUserValidationRules, loginUserController)
router.post("/forgot-password", forgotPasswordValidationRules, forgotPasswordController)
router.post( "/reset-password/:token", resetPasswordValidationRules, resetPasswordController)
router.post("/logout", authMiddleware, logoutUserController)


module.exports = router
