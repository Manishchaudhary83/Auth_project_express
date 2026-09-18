const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")

module.exports = {

    // REGISTER USER
    registerUser: async (data) => {

        try {

            const {fullName,username,email,phone,password} = data

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
    }
}
