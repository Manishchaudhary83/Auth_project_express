const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

module.exports = {

    // REGISTER USER
    registerUser: async (data) => {

        try {

            const {fullName,username,email,phone,password} = data

              // Check required fields
            if (!fullName || !username || !email || !phone || !password) {
                return {
                    message: "All fields are required",
                    status: 400
                }
            }

            // Check if email, username  already exists
            const existingUser = await userModel.findOne({
                $or: [
                    { email },
                    { username },
                ]
            })

            if (existingUser) {
              return {
                message: existingUser.email === email ? "Email is already registered" : "Username is already taken",
                status: 409
              }
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Create user
            const user = await userModel.create({
                fullName,
                username,
                email,
                phone,
                password: hashedPassword
            })

            // Return safe user data
            return {
                message: "User created successfully",
                status: 201,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            }
        }
        catch (error) {
            console.error("Register error:", error)
            throw new Error("Internal server error", 500)
        }
    },


    // LOGIN USER
    loginUser: async (data) => {

        try {
            const {username,email,password} = data

               // Check login fields
            if ((!username && !email) || !password) {
                return {
                    message: "Username or email and password are required",
                    status: 400
                }
            }

            // Find user by username or email
            const user = await userModel.findOne({
                $or: [
                    { username },
                    { email }
                ]
            }).select("+password")

            // User not found
            if (!user) {
                return {
                    message: "Invalid credentials",
                    status: 401
                }
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(
              password,
              user.password,
            )

            // Invalid password
            if (!isValidPassword) {
                return {
                    message: "Invalid credentials",
                    status: 401
                }
            }

            // Generate JWT
            const token = generateToken(user)
            console.log("TOKEN GENERATED:", token)

            // Return authentication response
            return {
                message: "Login successful",
                status: 200,
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            }

        }
        catch (error) {
            console.error("Auth service error:", error)
            throw new Error("Internal server error", 500)
        }
    },



     // FORGOT PASSWORD
    forgotPassword: async (email) => {

        try {

            // Find user by email
            const user = await userModel.findOne({
                email: email.toLowerCase()
            })

            // User not found
            if (!user) {
                return {
                    message:
                        "If the email exists, a password reset link has been sent",
                    status: 200
                }
            }

            // Generate random reset token
            const resetToken = crypto
                .randomBytes(32)
                .toString("hex")

            // Hash reset token before storing in database
            const hashedToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex")

            // Save hashed token
            user.resetPasswordToken = hashedToken

            // Token expires after 15 minutes
            user.resetPasswordExpires =
                Date.now() + 15 * 60 * 1000

            await user.save()

            // Create reset URL
            const resetUrl =
                `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

            // Send email
            await sendEmail({
                to: user.email,

                subject: "Password Reset Request",

                html: `
                    <h2>Password Reset</h2>

                    <p>Hello ${user.fullName},</p>

                    <p>
                        You requested to reset your password.
                    </p>

                    <p>
                        Click the link below to reset your password:
                    </p>

                    <p>
                        <a href="${resetUrl}">
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request this password reset,
                        please ignore this email.
                    </p>
                `
            })

            return {
                message:
                    "If the email exists, a password reset link has been sent",
                status: 200
            }

        } catch (error) {

            console.error("Forgot password error:", error)

            throw new Error("Internal server error", 500)
        }
    },



    //reset
    // RESET PASSWORD
resetPassword: async (token, newPassword) => {

    try {

        // Hash the token received from the URL
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        // Find user with valid token
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        })

        // Token invalid or expired
        if (!user) {
            return {
                status: 400,
                message: "Invalid or expired reset token"
            }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Update password
        user.password = hashedPassword

        // Remove reset token
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        // Save changes
        await user.save()

        return {
            status: 200,
            message: "Password reset successfully"
        }

    } catch (error) {

        console.error("Reset password error:", error)

        throw new Error("Internal server error", 500)
    }
}
}
