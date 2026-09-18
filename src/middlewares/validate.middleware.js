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

// =======================
// Register validation rules
// =======================
const registerUserValidationRules = [

    // Full name validation
    body("fullName")
        .isString()
        .withMessage("Full name must be a string")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    // Username validation
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),


    // Email validation
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    // Phone
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Invalid phone number"),

    // Password validation
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max:128})
        .withMessage("Password must be at least 8 characters"),

    // Run validation result
    validateResult
]



// =======================
//login validation rules
// ========================
const loginUserValidationRules = [

    body("username")
        .optional()
        .trim(),

    body("email")
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validateResult
]





module.exports = {
    registerUserValidationRules, loginUserValidationRules
}
