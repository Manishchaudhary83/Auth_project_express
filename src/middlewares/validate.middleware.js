const { body, validationResult } = require("express-validator")
// Check validation errors
async function validateResult(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()
}


// Register validation rules
const registerUserValidationRules = [

    // Full name validation
    body("fullName")
        .isString()
        .withMessage("Full name must be a string")
        .notEmpty()
        .withMessage("Full name is required"),

    // Username validation
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),

    // Email validation
    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    // Password validation
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    // Run validation result
    validateResult
]


module.exports = {
    registerUserValidationRules
}
